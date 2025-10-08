const Auction = require("../models/AuctionModel");
const Bid = require("../models/BidModel");

class AuctionRepository {
  async createAuction(data) {
    const auction = new Auction(data);
    return auction.save();
  }

  async startAuction(auctionId) {
    return Auction.findByIdAndUpdate(
      auctionId,
      { status: "active" },
      { new: true }
    );
  }

  async placeBid(auctionId, { dealerId, bidAmount }) {
    const lastBid = await Bid.findOne({ auction: auctionId }).sort({ createdAt: -1 });

    const bid = new Bid({
      auction: auctionId,
      dealer: dealerId,
      bidAmount,
      previousBid: lastBid ? lastBid.bidAmount : 0,
    });

    return bid.save();
  }

  async getWinnerBid(auctionId) {
    return Bid.findOne({ auction: auctionId })
      .sort({ bidAmount: -1 })
      .populate("dealer", "name email")
      .exec();
  }

  async endAuction(auctionId) {
    return await Auction.findByIdAndUpdate(
      auctionId,
      { status: "ended" },
      { new: true }
    );
  }

  async getAuctionById(auctionId) {
    return Auction.findById(auctionId);
  }
}

module.exports = new AuctionRepository();
