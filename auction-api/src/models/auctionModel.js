const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true }, // One car per auction
    startingPrice: { type: Number, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "ended"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Auction", AuctionSchema);
