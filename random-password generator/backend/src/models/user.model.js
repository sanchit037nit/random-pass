import mongoose from "mongoose";

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    emailid: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },

    loginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    
    lockUntil: {
      type: Date,
    },

    webauthnChallenge: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const user = mongoose.model("User", userschema);
export default user;
