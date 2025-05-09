import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Making function to connect to db

export async function connectDb() {
  if (cached.conn) {
    return cached.conn;
  }
  //  if promise to do connection then if promise doesn't return yet then,
  if (!cached.promise) {
    // It is checking if a promise for an existing database connection is already cached. This is a common pattern used to reuse the MongoDB connection instead of creating a new one on every request (important in serverless environments like Vercel).
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      /*What is bufferCommands?
      In Mongoose, bufferCommands controls whether Mongoose will queue operations (like .save(), .find(), etc.) before the connection to MongoDB is fully established.
      
      ✅ When bufferCommands: true (default):
      1.You can call model methods before the connection is ready.
      2.Mongoose queues the operations and runs them after connecting.
      Example:
      const user = new User({ name: "Alice" });
      user.save(); // Works even if the DB isn't connected yet

      ❌ When bufferCommands: false:
      If you call .save(), .find(), etc. before connection, Mongoose will throw an error like:
      MongooseError: Operation `users.insertOne()` buffering timed out after 10000ms


      🔧When to Use bufferCommands: false?
      You might disable it:
      
     1. In serverless environments (e.g., Vercel) where you want to fail fast if the connection isn't established.
      
     2. To avoid hidden bugs from queued operations that execute later.
      
     3. To prevent race conditions or stale data issues*/
    };

    //  creating a new promise if there is no promise 
    cached.promise = mongoose
      .connect(process.env.MONGO_URI!, opts)
      .then(() => mongoose.connection);
  }

  //  if promise exist then await for promise to return 
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  console.log("connection successfully");
  return cached.conn;
}
