const Dealer = require("../models/DealerModel");

class DealerRepository {
  async createDealer(data) {
    try {
      const dealer = new Dealer(data);
      return await dealer.save();
    } catch (error) {
      console.error("Error creating dealer:", error);
      throw new Error(error.message || "Failed to create dealer");
    }
  }

  async findDealerByEmail(email) {
    try {
      return await Dealer.findOne({ email });
    } catch (error) {
      console.error("Error finding dealer by email:", error);
      throw new Error("Failed to check dealer existence");
    }
  }

  async getDealerById(dealerId) {
    try {
      const dealer = await Dealer.findById(dealerId);
      if (!dealer) throw new Error("Dealer not found");
      return dealer;
    } catch (error) {
      console.error("Error fetching dealer by ID:", error);
      throw new Error("Failed to get dealer by ID");
    }
  }

  async getAllDealers() {
    try {
      return await Dealer.find();
    } catch (error) {
      console.error("Error fetching all dealers:", error);
      throw new Error("Failed to get all dealers");
    }
  }
}

module.exports = new DealerRepository();
