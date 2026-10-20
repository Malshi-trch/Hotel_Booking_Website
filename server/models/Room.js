const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Room name is required"], trim: true },
    type: {
      type: String,
      enum: ["Single", "Double", "Suite"],
      required: [true, "Room type is required"],
    },
    pricePerNight: { type: Number, required: [true, "Price is required"], min: 0 },
    capacity: { type: Number, required: [true, "Capacity is required"], min: 1 },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    amenities: { type: [String], default: [] },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);