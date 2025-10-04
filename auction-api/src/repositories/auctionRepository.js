const Auction = require("../models/AuctionModel");
const Bid = require("../models/BidModel");
const Dealer = require("../models/DealerModel");
const Car = require("../models/CarModel");

class AuctionRepository {
  async createAuction(data) {
    const car = await Car.findById(data.car);
    if (!car) throw new Error("Car not found");

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
    const auction = await Auction.findById(auctionId);
    if (!auction) throw new Error("Auction not found");

    const dealer = await Dealer.findById(dealerId);
    if (!dealer) throw new Error("Dealer not found");

    const lastBid = await Bid.findOne({ auction: auctionId }).sort({ createdAt: -1 });

    const bid = new Bid({
      auction: auctionId,
      dealer: dealerId,
      bidAmount,
      previousBid: lastBid ? lastBid.bidAmount : null,
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
}

module.exports = new AuctionRepository();
