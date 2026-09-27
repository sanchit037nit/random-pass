import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const unlockAll = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const result = await User.updateMany({}, { $set: { loginAttempts: 0 }, $unset: { lockUntil: "" } });
    console.log(`Successfully unlocked accounts. Modified ${result.modifiedCount} users.`);
    process.exit(0);
  } catch (err) {
    console.error("Error unlocking accounts:", err);
    process.exit(1);
  }
};

unlockAll();
