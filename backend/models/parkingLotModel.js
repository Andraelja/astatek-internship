const mongoose = require("mongoose");

const parkingLotSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    total_slots: { type: Number, required: true },
    available_slots: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ParkingLot", parkingLotSchema);
