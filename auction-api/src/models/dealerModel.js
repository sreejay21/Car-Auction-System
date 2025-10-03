const mongoose = require("mongoose");

const dealerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    auctions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dealer", dealerSchema);
