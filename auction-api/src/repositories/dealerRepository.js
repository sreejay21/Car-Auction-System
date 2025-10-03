const Dealer = require("../models/DealerModel");

class DealerRepository {
  async createDealer(data) {
    const existingDealer = await Dealer.findOne({ email: data.email });
    if (existingDealer) throw new Error("Dealer already exists");

    const dealer = new Dealer(data);
    return dealer.save();
  }

  async getDealerById(dealerId) {
    return Dealer.findById(dealerId);
  }

  async getAllDealers() {
    return Dealer.find();
  }
}

module.exports = new DealerRepository();
