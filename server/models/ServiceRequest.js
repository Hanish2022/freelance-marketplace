import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Completed", "Cancelled"],
    default: "Open",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  budget: {
    type: Number,
    required: [true, "Budget is required"],
  },
  deadline: {
    type: Date,
    required: [true, "Deadline is required"],
  },
  skills: [{
    type: String,
    required: [true, "At least one skill is required"],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
serviceRequestSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest; 