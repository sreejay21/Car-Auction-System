const mongoose = require("mongoose");

const BidSchema = new mongoose.Schema(
  {
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    dealer: { type: mongoose.Schema.Types.ObjectId, ref: "Dealer", required: true },
    bidAmount: { type: Number, required: true },
    previousBid: { type: Number }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", BidSchema);
