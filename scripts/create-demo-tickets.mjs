import mongoose from "mongoose";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

const MONGODB_URL = process.env.MONGODB_URL;

if (!MONGODB_URL) {
  console.error("Missing MONGODB_URL environment variable.");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    role: { type: String, enum: ["customer", "restaurant", "rider", "admin"], required: true },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

const TicketMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, enum: ["merchant", "agent"], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now, required: true },
    avatar: { type: String },
  },
  { _id: false }
);

const TicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    subject: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Payment", "Order Issue", "Technical", "Account", "General"], required: true, default: "General" },
    priority: { type: String, enum: ["low", "medium", "high"], required: true, default: "medium" },
    status: { type: String, enum: ["open", "in_progress", "resolved"], required: true, default: "open" },
    messages: { type: [TicketMessageSchema], default: [] },
  },
  { timestamps: true }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", TicketSchema, "tickets");

const demoTickets = [
  {
    ticketId: "TK-8492",
    subject: "Missing payment for Order #1024",
    category: "Payment",
    priority: "high",
    status: "open",
    messages: [
      {
        sender: "merchant",
        text: "Hello, I haven't received the payout for Order #1024 delivered yesterday. It shows as 'Pending' in my dashboard.",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "Hi there. I apologize for the delay. Let me look into Order #1024 for you right now.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8488",
    subject: "Customer claims missing item",
    category: "Order Issue",
    priority: "medium",
    status: "in_progress",
    messages: [
      {
        sender: "merchant",
        text: "A customer reported that their order #1020 was missing a side of fries. This happened yesterday.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "I've checked the order details and confirmed the fries were not included in the packing. I'll issue a full refund for the missing item.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
      },
      {
        sender: "merchant",
        text: "Thank you. I've also spoken with my kitchen staff to ensure this doesn't happen again.",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8475",
    subject: "Menu update request not processed",
    category: "Technical",
    priority: "low",
    status: "resolved",
    messages: [
      {
        sender: "merchant",
        text: "I submitted menu changes for the 'Burgers' category two days ago but they still show as pending review.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "Hi, I've checked our moderation queue and your changes were approved but there was a sync delay. The updates should be visible now.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "merchant",
        text: "Confirmed - the menu is now showing correctly. Thanks for the help!",
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8468",
    subject: "Unable to update restaurant hours",
    category: "Account",
    priority: "medium",
    status: "resolved",
    messages: [
      {
        sender: "merchant",
        text: "The opening/closing hours form keeps resetting after I save changes. This has been happening for a week.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "We've identified and fixed the bug. You should be able to update your hours successfully now.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "merchant",
        text: "Confirmed fixed. Thank you!",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8451",
    subject: "Payout threshold notification not working",
    category: "Payment",
    priority: "low",
    status: "resolved",
    messages: [
      {
        sender: "merchant",
        text: "I set the payout threshold to 1000 BDT but never received an email when I crossed it.",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "Our notification system had a configuration issue for your region. It's been fixed and you'll now receive email alerts.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8503",
    subject: "Duplicate charge on customer order",
    category: "Payment",
    priority: "high",
    status: "open",
    messages: [
      {
        sender: "merchant",
        text: "A customer was charged twice for Order #1035. The payment gateway shows two identical transactions.",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8496",
    subject: "Delivery tracking stuck at 'Preparing'",
    category: "Technical",
    priority: "medium",
    status: "in_progress",
    messages: [
      {
        sender: "merchant",
        text: "Order #1028 has been prepared for 2 hours but the tracking screen still shows 'Preparing'. The rider hasn't picked it up.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "I've manually assigned a new rider to this order and updated the tracking status to 'Picked Up'.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8511",
    subject: "Restaurant profile photo upload failing",
    category: "Technical",
    priority: "medium",
    status: "open",
    messages: [
      {
        sender: "merchant",
        text: "I've been trying to upload a new logo for my restaurant but the upload keeps failing with a 500 error. I've tried different file sizes and formats.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8507",
    subject: "Menu item disappeared from online catalog",
    category: "Technical",
    priority: "high",
    status: "open",
    messages: [
      {
        sender: "merchant",
        text: "The 'Vegan Burger' item that was showing on my online menu has completely disappeared. I didn't mark it as inactive.",
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "I can see the issue. The item was accidentally deactivated during a recent sync. I've reactivated it — it should be visible again within 5 minutes.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
      },
    ],
  },
  {
    ticketId: "TK-8482",
    subject: "Unable to log in to vendor dashboard",
    category: "Account",
    priority: "low",
    status: "resolved",
    messages: [
      {
        sender: "merchant",
        text: "I'm unable to log into the vendor dashboard. My credentials work on the customer app but not on the admin panel.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "agent",
        text: "This was a known session issue. Please clear your browser cookies and try logging in again. The fix has been deployed to production.",
        avatar: "SA",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        sender: "merchant",
        text: "It works now. Thanks!",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

const now = new Date();

async function main() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  const input = (await rl.question("Restaurant user email (press Enter for first restaurant user): ")).trim().toLowerCase();
  rl.close();

  await mongoose.connect(MONGODB_URL, { dbName: "FoodBackend" });

  let user;
  if (input && input !== "any" && input !== "any email") {
    user = await User.findOne({ email: input });
    if (!user) {
      console.error(`No user found with email ${input}.`);
      await mongoose.disconnect();
      process.exit(1);
    }
  } else {
    user = await User.findOne({ role: "restaurant" }).sort({ createdAt: -1 });
    if (!user) {
      console.error("No restaurant users found in the database. Please create a restaurant account first.");
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`Using restaurant user: ${user.email} (${user.name})`);
  }

  let created = 0;
  for (const demo of demoTickets) {
    const existing = await Ticket.findOne({ ticketId: demo.ticketId });
    if (existing) {
      console.log(`  ${demo.ticketId} — skipped (already exists)`);
      continue;
    }

    const ticket = await Ticket.create({
      ticketId: demo.ticketId,
      vendorId: user._id,
      subject: demo.subject,
      category: demo.category,
      priority: demo.priority,
      status: demo.status,
      messages: demo.messages,
      createdAt: demo.messages[0]?.timestamp || now,
      updatedAt: demo.messages[demo.messages.length - 1]?.timestamp || now,
    });

    console.log(`  ${ticket.ticketId} — created (${ticket.status}, ${ticket.priority} priority)`);
    created++;
  }

  console.log(`\nDone! Created ${created} demo support tickets for ${user.email} (${user.name}).`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});