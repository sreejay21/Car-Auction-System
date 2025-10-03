const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema(
  {
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Car", CarSchema);
