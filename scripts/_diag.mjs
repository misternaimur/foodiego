import mongoose from "mongoose";

await mongoose.connect(process.env.MONGODB_URL, { dbName: "FoodBackend" });
const db = mongoose.connection.db;

const cols = await db.listCollections().toArray();
console.log("collections:", cols.map((c) => c.name).sort());

for (const name of ["users", "rider", "restaurant"]) {
  const c = db.collection(name);
  const count = await c.countDocuments();
  const recent = await c.find({}).sort({ _id: -1 }).limit(6).toArray();
  console.log(`\n=== ${name} (${count}) ===`);
  for (const d of recent) {
    if (name === "users")
      console.log(`  ${d._id}  role=${d.role}  ${d.email}  uid=${d.uid}  ${d.createdAt?.toISOString?.() ?? ""}`);
    else
      console.log(
        `  ${d._id}  userId=${d.userId}  status=${d.status}  ${d.email}  name=${d.fullName ?? d.restaurantName}  phone=${d.phone}  addr=${d.address}  ${d.createdAt?.toISOString?.() ?? ""}`
      );
  }
}

await mongoose.disconnect();
