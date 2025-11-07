const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingLot",
      required: true,
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParkingSlot",
      required: true,
    },
    status: {
      type: String,
      enum: ["RESERVED", "OCCUPIED", "COMPLETED", "CANCELLED"],
      default: "RESERVED",
    },
    checkin_time: Date,
    checkout_time: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
