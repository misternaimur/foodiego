import mongoose from "mongoose";

const MONGODB_URL = process.env.MongoDB_URL;

if (!MONGODB_URL) {
  throw new Error("Missing MongoDB_URL environment variable");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cache;

export async function dbConnect() {
  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URL as string, {
      dbName: "foodiego",
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;
