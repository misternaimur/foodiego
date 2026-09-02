"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  Bot, 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  AlertCircle,
  RefreshCw,
  Send,
  CheckCircle2
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'growth' | 'warning' | 'tip';
  title: string;
  description: string;
  actionText?: string;
}

const initialInsights: AIInsight[] = [
  {
    id: "1",
    type: "growth",
    title: "Revenue Surge Detected",
    description: "Gross revenue increased by 12.8% this month, primarily driven by repeat orders in the Downtown Core sector.",
    actionText: "View Regional Breakdown"
  },
  {
    id: "2",
    type: "warning",
    title: "AOV Dip Warning",
    description: "Average Order Value experienced a minor 1.4% decrease compared to last month. Consider bundling high-margin items.",
    actionText: "Configure Bundles"
  },
  {
    id: "3",
    type: "tip",
    title: "Customer Retention Opportunity",
    description: "Customer retention is strong at 68.2%. Launching a VIP loyalty tier could capture the remaining 15% segment effectively.",
    actionText: "Explore Loyalty Options"
  }
];

export default function BusinessInsightsAIModule() {
  // Structured state ready for backend API endpoints / AI agent connection
  const [insights, setInsights] = useState<AIInsight[]>(initialInsights);
  const [promptQuery, setPromptQuery] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Handler ready to be wired up with a POST request to your backend AI model service
  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptQuery.trim()) return;

    setIsGenerating(true);
    setAiResponse(null);

    setTimeout(() => {
      setAiResponse(`Based on your recent analytics data for the selected period, "${promptQuery}" suggests focusing on peak weekend hours when order volume peaks by 34%.`);
      setIsGenerating(false);
      setPromptQuery("");
    }, 1000);
  };

  return (
    <section className="bg-white rounded-2xl border border-gray-200 shadow-2xs p-6 space-y-6 font-sans">
      
      {/* Header with AI Branding */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              Growth AI Assistant
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                Beta
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Automated smart insights and predictive recommendations for your business workflows.
            </p>
          </div>
        </div>
        <button 
          onClick={() => alert("Refreshing AI data model...")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={13} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* AI Smart Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => (
          <div 
            key={item.id} 
            className="p-4 rounded-xl border border-gray-100 bg-[#f8fafc]/60 hover:bg-[#f8fafc] transition-all flex flex-col justify-between space-y-3"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  {item.type === 'growth' && <TrendingUp size={14} className="text-emerald-600" />}
                  {item.type === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
                  {item.type === 'tip' && <Lightbulb size={14} className="text-indigo-500" />}
                  {item.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
            {item.actionText && (
              <button 
                onClick={() => alert(`Executing action: ${item.actionText}`)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#059669] hover:underline cursor-pointer pt-1"
              >
                <span>{item.actionText}</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Interactive AI Prompt Query Box */}
      <div className="bg-emerald-50/40 rounded-xl p-5 border border-emerald-100 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
          <Bot size={16} className="text-[#059669]" />
          <span>Ask Growth AI anything about your store performance:</span>
        </div>

        <form onSubmit={handleAskAI} className="flex gap-2">
          <input 
            type="text"
            value={promptQuery}
            onChange={(e) => setPromptQuery(e.target.value)}
            placeholder="e.g., How can I improve customer retention in Westside Suburbs?"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669] focus:border-transparent"
          />
          <button 
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-semibold shadow-2xs transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Send size={14} />
                <span>Ask AI</span>
              </>
            )}
          </button>
        </form>

        {/* Dynamic AI Generated Response Display */}
        {aiResponse && (
          <div className="mt-3 p-3.5 bg-white rounded-xl border border-emerald-200 text-xs text-gray-800 flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 size={16} className="text-[#059669] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-gray-950 block mb-0.5">AI Recommendation:</span>
              {aiResponse}
            </div>
          </div>
        )}
      </div>

    </section>
  );
}