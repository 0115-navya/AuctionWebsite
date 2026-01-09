import { Auction } from "../models/auction.models.js";
import { getAuctionStatus } from "../utils/actionStatus.js";

// Admin: Create auction
export const createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, startTime, endTime } = req.body;

    const auction = await Auction.create({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice,
      startTime,
      endTime,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Auction created successfully",
      auction,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// Public: Get all auctions
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ createdAt: -1 });
    const updatedAuctions = auctions.map((auction) => {
      const status = getAuctionStatus(
        auction.startTime,
        auction.endTime
      );

      return {
        ...auction.toObject(),
        status,
        };
    });
    return res.status(200).json(updatedAuctions);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
