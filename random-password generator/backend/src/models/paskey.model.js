import mongoose from "mongoose";

const passkeySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  credentialID: {
    type: String,
    required: true,
    unique: true,
  },

  publicKey: {
    type: String,
    required: true,
  },

  counter: {
    type: Number,
    default: 0,
  },

  transports: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Passkey = mongoose.model("Passkey", passkeySchema);

export default Passkey;
