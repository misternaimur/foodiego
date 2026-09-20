import { createServer } from "http";
import { Server } from "socket.io";

const PORT = 5000;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

console.log(`[MockSocket.io] WebSocket server listening on http://localhost:${PORT}`);

const customerNames = [
  "Rahim Ahmed", "Sarah T.", "Nahid R.", "Sadia K.", "Tanvir M.",
  "Farzana S.", "Kamal H.", "Rina P.", "Arif B.", "Tasnim M.",
  "Fahim K.", "Jannat A.", "Mizanur R.", "Shirin T.", "Rafi U.",
];

const itemNames = [
  "Classic Burger", "Spicy Chicken Wrap", "French Fries", "Cola",
  "Margherita Pizza", "Pepperoni Pizza", "Chicken Wings", "Milkshake",
  "Brownie", "Garlic Bread", "Caesar Salad", "Pasta",
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let orderSequence = 20001;

function makeOrder() {
  const orderNum = `#FG${orderSequence++}`;
  const numItems = getRandomInt(1, 3);
  const items = Array.from({ length: numItems }, (_, idx) => ({
    id: `item_${orderSequence}_${idx}`,
    name: itemNames[getRandomInt(0, itemNames.length - 1)],
    quantity: getRandomInt(1, 3),
    price: getRandomInt(120, 550),
    image: "",
    addons: [],
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (Math.random() > 0.5 ? getRandomInt(20, 100) : 0);
  const customerName = customerNames[Math.floor(Math.random() * customerNames.length)];

  return {
    id: orderNum,
    orderNumber: orderNum,
    customerName,
    customer: {
      name: customerName,
      phone: `+880 1${getRandomInt(10000000, 99999999)}`,
      address: `${getRandomInt(1, 99)}, Main Road, Dhaka`,
      orderCount: getRandomInt(1, 30),
      avatar: "",
      email: "",
    },
    items,
    total,
    paymentMethod: Math.random() > 0.5 ? "bKash" : "cash",
    paymentStatus: Math.random() > 0.3 ? "paid" : "pending",
    createdAt: "Today",
    timeAgo: "Just now",
    address: `${getRandomInt(1, 99)}, Main Road, Dhaka`,
    phone: `+880 1${getRandomInt(10000000, 99999999)}`,
    status: "new",
    subtotal,
    deliveryFee: 50,
  };
}

let runningSales = 148500;
let runningOrders = 1248;
let runningAvgOrder = 119;
let runningOPM = 7;

function makeAnalyticsTick() {
  const order = makeOrder();
  runningSales += order.total;
  runningOrders += 1;
  runningAvgOrder = Math.round(runningSales / runningOrders);
  runningOPM = getRandomInt(3, 15);

  return {
    type: "ANALYTICS_TICK_UPDATE",
    payload: {
      sales: runningSales,
      orders: runningOrders,
      avgOrderValue: runningAvgOrder,
      ordersPerMinute: runningOPM,
      timestamp: new Date().toISOString(),
    },
  };
}

const agentMessages = [
  "I've looked into your order and I'm tracking the payment now. You should see the payout within 24 hours.",
  "Thank you for bringing this to our attention. I've escalated this to our technical team and they're working on it.",
  "I can confirm the order was delivered correctly. The missing item has been refunded to the customer's account.",
  "I've checked the order details and confirmed the fries were not packed. A full refund has been issued.",
  "The menu sync issue has been resolved. Your updates should now be visible across all platforms.",
  "I've manually assigned a new rider to this order and updated the tracking status.",
  "Our development team has deployed a fix for the hours update bug. Please try updating your hours again.",
];

const openTicketIds = ["TK-8492", "TK-8503", "TK-8511", "TK-8507"];

const reviewTexts = [
  "Amazing food! The truffle burger was cooked to perfection and the fries were crispy. Delivery was super fast!",
  "Best pizza in town! The crust was perfectly crispy on the outside and soft on the inside.",
  "The milkshake was thick and creamy, and the brownie was perfectly sweet.",
  "Excellent plant-based burger! Even my non-vegetarian family loved it.",
  "Best breakfast burrito I've had in Dhaka! The eggs were perfectly cooked.",
  "Great chicken wrap, but the coleslaw was a bit soggy. Still, the flavors were excellent.",
  "The wings were good but a bit dry. The blue cheese dip was great though.",
  "Very disappointed. The fish was bland and the chips were undercooked.",
  "Best meal I've had all week! The presentation was beautiful and the flavors were incredible.",
  "Fantastic service from start to finish! The classic burger hit the spot.",
];

const reviewCustomers = [
  "Sarah M.", "David C.", "Elena R.", "Nahid R.", "Sadia K.",
  "Farzana S.", "Arif B.", "Rina P.", "Kamal H.", "Tasnim M.",
  "Fahim K.", "Jannat A.", "Mizanur R.", "Shirin T.", "Rafi U.",
];

const orderItems = [
  "Truffle Burger Combo", "Spicy Chicken Wrap Meal", "Margherita Pizza",
  "Pepperoni Pizza Feast", "Classic Burger Meal", "Chicken Wings Combo",
  "Fish & Chips", "Veggie Burger", "Milkshake & Brownie", "Breakfast Burrito",
];

function makeReview() {
  const orderId = `ORD-${20000 + orderSequence}`;
  orderSequence++;
  const rating = getRandomInt(1, 5);
  const customer = reviewCustomers[Math.floor(Math.random() * reviewCustomers.length)];
  const text = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
  const orderName = orderItems[Math.floor(Math.random() * orderItems.length)];

  let sentiment = "positive";
  if (rating <= 2) sentiment = "negative";
  else if (rating === 3) sentiment = "neutral";

  return {
    type: "NEW_REVIEW_TICK",
    payload: {
      id: `rev_${orderSequence}`,
      orderId,
      orderName,
      customerName: customer,
      rating,
      timeAgo: "Just now",
      createdAt: new Date().toISOString(),
      text,
      sentiment,
    },
  };
}

function makeSupportMessage(ticketId) {
  return {
    type: "SUPPORT_TICKET_MSG",
    payload: {
      ticketId,
      message: {
        sender: "agent",
        text: agentMessages[Math.floor(Math.random() * agentMessages.length)],
        timestamp: new Date().toISOString(),
        avatar: "SA",
      },
    },
  };
}

io.on("connection", (socket) => {
  console.log(`[MockSocket.io] Client connected: ${socket.id}`);

  socket.on("subscribe", (payload) => {
    console.log(`[MockSocket.io] Client subscribed: ${JSON.stringify(payload?.roles)}`);
    socket.emit("SUBSCRIBED", { status: "ok" });
  });

  socket.on("disconnect", (reason) => {
    console.log(`[MockSocket.io] Client disconnected: ${socket.id} (${reason})`);
  });

  socket.on("error", (err) => {
    console.error(`[MockSocket.io] Socket error: ${err}`);
  });
});

const activeRiderOrders = [
  { orderId: "#FG10234", riderId: "rider_002", lat: 23.7891, lng: 90.4089, destLat: 23.7845, destLng: 90.4032 },
  { orderId: "#FG10229", riderId: "rider_006", lat: 23.7712, lng: 90.3987, destLat: 23.7689, destLng: 90.3921 },
  { orderId: "#FG10230", riderId: "rider_001", lat: 23.7589, lng: 90.4051, destLat: 23.7615, destLng: 90.4092 },
  { orderId: "#FG10228", riderId: "rider_003", lat: 23.7731, lng: 90.3967, destLat: 23.7783, destLng: 90.4005 },
  { orderId: "#FG10225", riderId: "rider_002", lat: 23.7598, lng: 90.4052, destLat: 23.7633, destLng: 90.4081 },
];

function makeRiderLocationUpdate() {
  const riderOrder = activeRiderOrders[Math.floor(Math.random() * activeRiderOrders.length)];
  const step = 0.0005;
  const dx = riderOrder.destLat - riderOrder.lat;
  const dy = riderOrder.destLng - riderOrder.lng;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist > 0.001) {
    riderOrder.lat += (dx / dist) * step;
    riderOrder.lng += (dy / dist) * step;
  }

  const speed = getRandomInt(15, 40);
  const bearing = Math.atan2(dy, dx) * (180 / Math.PI);

  return {
    type: "RIDER_LOCATION_UPDATE",
    payload: {
      orderId: riderOrder.orderId,
      riderId: riderOrder.riderId,
      lat: riderOrder.lat,
      lng: riderOrder.lng,
      speed,
      bearing,
      timestamp: new Date().toISOString(),
    },
  };
}

let analyticsCounter = 0;
let orderCounter = 0;
let messageCounter = 0;
let locationCounter = 0;

setInterval(() => {
  const update = makeAnalyticsTick();
  io.emit(update.type, update.payload);
  analyticsCounter++;
}, 4000);

setInterval(() => {
  const order = makeOrder();
  io.emit("NEW_ORDER_RECEIVED", order);
  orderCounter++;
}, 12000);

setInterval(() => {
  const ticketId = openTicketIds[Math.floor(Math.random() * openTicketIds.length)];
  const msg = makeSupportMessage(ticketId);
  io.emit(msg.type, msg.payload);
  messageCounter++;
}, 8000);

setInterval(() => {
  const update = makeRiderLocationUpdate();
  io.emit(update.type, update.payload);
  locationCounter++;
}, 2000);

let reviewCounter = 0;

const paymentCustomers = [
  "Sarah M.", "David C.", "Elena R.", "Mike K.", "Tanvir M.",
  "Farzana S.", "Kamal H.", "Rina P.", "Arif B.", "Nahid R.",
  "Sadia K.", "Tasnim M.", "Fahim K.", "Jannat A.", "Rafi U.",
];

const paymentItems = [
  "Spicy Beef Burger", "Truffle Burger Combo", "Margherita Pizza",
  "Pepperoni Pizza Feast", "Classic Chicken Burger", "Fish & Chips Meal",
  "Veggie Wrap", "Chicken Wings", "Pasta Alfredo", "Caesar Salad",
];

let paymentCounter = 0;

function makePaymentTick() {
  paymentCounter++;
  const customer = paymentCustomers[Math.floor(Math.random() * paymentCustomers.length)];
  const item = paymentItems[Math.floor(Math.random() * paymentItems.length)];
  const grossAmount = getRandomInt(500, 1500);
  const commission = Math.round(grossAmount * 0.15);
  const netEarnings = grossAmount - commission;
  const orderId = `#ORD-${5520 + paymentCounter}`;
  const txId = `TXN-98${234 + paymentCounter}-LIVE`;

  return {
    type: "PAYMENT_TICK_UPDATE",
    payload: {
      id: txId,
      orderId,
      customerName: customer,
      itemName: item,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      grossAmount,
      commission,
      netEarnings,
      delta: 25,
      status: "Paid",
      timestamp: new Date().toISOString(),
    },
  };
}

setInterval(() => {
  const review = makeReview();
  io.emit(review.type, review.payload);
  reviewCounter++;
}, 15000);

let paymentTickCounter = 0;

setInterval(() => {
  const update = makePaymentTick();
  io.emit(update.type, update.payload);
  paymentTickCounter++;
}, 3000);

setInterval(() => {
  const connections = io.engine.clientsCount;
  console.log(`[MockSocket.io] Stats: analytics=${analyticsCounter}, orders=${orderCounter}, messages=${messageCounter}, locations=${locationCounter}, reviews=${reviewCounter}, payments=${paymentTickCounter}, connections=${connections}`);
}, 30000);

httpServer.listen(PORT, () => {
  console.log(`[MockSocket.io] Server ready on http://localhost:${PORT}`);
});
