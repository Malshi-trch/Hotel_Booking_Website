const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
        checkIn: { type: Date, required: [true, "Check-in date is required"] },
        checkOut: { type: Date, required: [true, "Check-out date is required"] },
        guests: { type: Number, required: [true, "Number of guests are required"], min: 1},
        totalPrice: { type: Number, required: true, min: 0 },
        status: { type:String, enum: ["confirmed", "cancelled"], default: "confirmed" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);