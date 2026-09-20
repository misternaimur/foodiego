import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are an AI assistant for FoodieGo, a food delivery website. You can ONLY answer questions related to this website (dishes, orders, delivery, payment methods, etc.). If someone asks anything unrelated to this website, say: \"I'm only able to provide answers related to this website.\" Do not answer any other questions.";

const GROQ_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "gemma2-9b-it",
  "llama3-70b-8192",
];

const GEMINI_MODELS = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];

async function callGroq(
  apiKey: string,
  userMessage: string,
  chatHistory: { sender: string; text: string }[],
): Promise<string> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...chatHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    })),
    { role: "user", content: userMessage },
  ];

  for (const model of GROQ_MODELS) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          return content;
        }
        throw new Error("Empty response");
      }

      try {
        const error = await response.json();
        const errMsg = error.error?.message || `Groq API error: ${response.status}`;
        const isKeyError = errMsg.toLowerCase().includes("invalid") || errMsg.toLowerCase().includes("unauthorized");
        const isRateLimit = response.status === 429 || errMsg.toLowerCase().includes("rate limit");
        if (isKeyError) throw new Error(errMsg);
        if (isRateLimit) throw new Error(errMsg);
        console.warn(`Groq model ${model} failed: ${errMsg}, trying next...`);
      } catch {
        throw new Error(`Groq API error: ${response.status}`);
      }
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "";
      const isKeyError = errMsg.toLowerCase().includes("invalid") || errMsg.toLowerCase().includes("unauthorized");
      if (isKeyError) throw error;
      console.warn(`Groq model ${model} failed, trying next...`);
    }
  }

  throw new Error("All Groq models failed");
}

async function callGemini(
  apiKey: string,
  userMessage: string,
  chatHistory: { sender: string; text: string }[],
): Promise<string> {
  const { GoogleGenAI } = await import("@google/genai");
  const ai = new GoogleGenAI({ apiKey });

  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    ...chatHistory.map((msg) => ({
      role: msg.sender === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
    { role: "user", parts: [{ text: userMessage }] },
  ];

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({ model, contents });
      const t = response.text;
      return typeof t === "string" ? t : "";
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : "";
      console.warn(`Gemini model ${model} failed: ${errMsg}, trying next...`);
    }
  }

  throw new Error("All Gemini models failed");
}

function getLocalReply(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (/(order|track|cancel|reorder|history)/.test(normalizedMessage)) {
    return "You can view your orders from your account dashboard. Open an order to check its status, delivery details, or available actions.";
  }

  if (/(deliver|rider|arrive|shipping)/.test(normalizedMessage)) {
    return "Delivery estimates and rider updates are shown on the order tracking page after checkout. Typical delivery takes 30-40 minutes, depending on the restaurant and distance.";
  }

  if (/(pay|card|promo|discount|refund|wallet|money)/.test(normalizedMessage)) {
    return "FoodieGo supports the payment methods shown during checkout. Promo codes can be applied before placing an order, and refund requests can be made from the order details page.";
  }

  if (/(food|eat|meal|burger|pizza|restaurant|recommend|dish|menu)/.test(normalizedMessage)) {
    return "Browse the Foods and Restaurants pages to discover popular dishes, top-rated restaurants, and available offers. You can save favorites and add dishes directly to your cart.";
  }

  return "I can help with FoodieGo dishes, restaurants, orders, delivery, payments, and promotions. What would you like to know?";
}

export async function POST(req: NextRequest) {
  try {
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const body = await req.json();
    const { message, chatHistory = [] } = body;

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A message is required." },
        { status: 400 },
      );
    }

    if (groqKey) {
      try {
        const reply = await callGroq(groqKey, message, chatHistory);
        if (reply) {
          return NextResponse.json({ reply, source: "groq" });
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "";
        console.error("Groq API Error:", errMsg);
      }
    }

    if (geminiKey) {
      try {
        const reply = await callGemini(geminiKey, message, chatHistory);
        if (reply) {
          return NextResponse.json({ reply, source: "gemini" });
        }
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : "";
        console.error("Gemini API Error:", errMsg);
      }
    }

    return NextResponse.json({ reply: getLocalReply(message), source: "local" });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    console.error("AI Backend Error:", errMsg);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 },
    );
  }
}
