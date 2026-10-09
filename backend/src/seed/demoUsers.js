require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const demoUsers = [
  { name: "Demo ASHA Worker", email: "asha@swasthone.demo", password: "Demo@123", role: "health_worker" },
  { name: "Demo Doctor", email: "doctor@swasthone.demo", password: "Demo@123", role: "doctor" },
  { name: "Demo Admin", email: "admin@swasthone.demo", password: "Demo@123", role: "admin" },
];

async function seedDemoUsers() {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_SEED !== "true") {
    throw new Error("Refusing to seed public demo accounts in production (set ALLOW_DEMO_SEED=true to override).");
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in backend/.env");

  await mongoose.connect(uri);
  console.log("MongoDB connected for demo user seeding");

  for (const demo of demoUsers) {
    const password = await bcrypt.hash(demo.password, 10);
    await User.findOneAndUpdate(
      { email: demo.email },
      { $set: { name: demo.name, email: demo.email, password, role: demo.role } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    console.log(`Seeded ${demo.role}: ${demo.email}`);
  }

  console.log("Demo users are ready.");
}

seedDemoUsers()
  .catch((error) => {
    console.error("Demo user seed failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
