import mongoose from "mongoose";

const skillExchangeSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skill1: {
    type: String,
    required: true,
  },
  skill2: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Completed"],
    default: "Pending",
  },
  credits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

// Update timestamp on save
skillExchangeSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

export const SkillExchange = mongoose.model("SkillExchange", skillExchangeSchema);
