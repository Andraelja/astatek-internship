const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  lot_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ParkingLot",
    required: true,
  },
  slot_number: { type: String, required: true },
  status: {
    type: String,
    enum: ["AVAILABLE", "OCCUPIED", "RESERVED"],
    default: "AVAILABLE",
  },
  last_updated: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);