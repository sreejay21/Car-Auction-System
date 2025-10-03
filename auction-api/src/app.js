const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../src/config/db");

dotenv.config();
connectDB();

const authRoutes = require("./routes/authRoutes");
const auctionRoutes = require("./routes/auctionRoutes");
const carRoutes = require("./routes/carRoutes");
const dealerRoutes = require("./routes/dealerRoutes");

const app = express();
app.use(express.json());

app.use("/api/v1/auction", auctionRoutes);
app.use("/api/v1/cars", carRoutes);
app.use("/api/v1/dealer", dealerRoutes);
app.use("/api/v1/auction", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

module.exports = app;
