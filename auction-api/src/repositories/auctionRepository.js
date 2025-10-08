const Auction = require("../models/AuctionModel");
const Bid = require("../models/BidModel");

class AuctionRepository {
  async createAuction(data) {
    try {
      const auction = new Auction(data);
      return await auction.save();
    } catch (error) {
      console.error("Error creating auction:", error);
      throw new Error("Failed to create auction");
    }
  }

  async startAuction(auctionId) {
    try {
      const auction = await Auction.findByIdAndUpdate(
        auctionId,
        { status: "active" },
        { new: true }
      );
      return auction;
    } catch (error) {
      console.error("Error starting auction:", error);
      throw new Error("Failed to start auction");
    }
  }

  async placeBid(auctionId, { dealerId, bidAmount }) {
    try {
      const lastBid = await Bid.findOne({ auction: auctionId }).sort({ createdAt: -1 });

      const bid = new Bid({
        auction: auctionId,
        dealer: dealerId,
        bidAmount,
        previousBid: lastBid ? lastBid.bidAmount : 0,
      });

      return await bid.save();
    } catch (error) {
      console.error("Error placing bid:", error);
      throw new Error("Failed to place bid");
    }
  }

  async getWinnerBid(auctionId) {
    try {
      const winnerBid = await Bid.findOne({ auction: auctionId })
        .sort({ bidAmount: -1 })
        .populate("dealer", "name email")
        .exec();
      return winnerBid;
    } catch (error) {
      console.error("Error getting winner bid:", error);
      throw new Error("Failed to get winner bid");
    }
  }

  async endAuction(auctionId) {
    try {
      const auction = await Auction.findByIdAndUpdate(
        auctionId,
        { status: "ended" },
        { new: true }
      );
      return auction;
    } catch (error) {
      console.error("Error ending auction:", error);
      throw new Error("Failed to end auction");
    }
  }

  async getAuctionById(auctionId) {
    try {
      const auction = await Auction.findById(auctionId);
      return auction;
    } catch (error) {
      console.error("Error fetching auction by ID:", error);
      throw new Error("Failed to get auction by ID");
    }
  }
}

module.exports = new AuctionRepository();
