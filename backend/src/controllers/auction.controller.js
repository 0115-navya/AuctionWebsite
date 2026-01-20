import { Auction } from "../models/auction.models.js";
import { getAuctionStatus } from "../utils/actionStatus.js";

// Admin: Create auction
export const createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, startTime, endTime } = req.body;
    if (!title || !description || !startingPrice || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (new Date(startTime) >= new Date(endTime)) {
      return res
        .status(400)
        .json({ message: "End time must be after start time" });
    }
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
    const auctions = await Auction.find()
    .populate("createdBy", "username email role")
    .sort({ createdAt: -1 });

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
export const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id)
    .populate(
      "createdBy",
      "name email role"
    )
    .populate("highestBidder", "name email");

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const status = getAuctionStatus(auction.startTime, auction.endTime);

    return res.status(200).json({
      ...auction.toObject(),
      status,
    });
  } catch (error) {
    console.error("Get auction by id error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
export const updateAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Prevent updating ended auctions
    const status = getAuctionStatus(auction.startTime, auction.endTime);
    if (status === "ended") {
      return res
        .status(400)
        .json({ message: "Cannot update ended auction" });
    }

    Object.assign(auction, req.body);
    await auction.save();

    res.status(200).json({
      message: "Auction updated successfully",
      auction,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteAuction = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);  
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }
    await auction.deleteOne();
    res.status(200).json({ message: "Auction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    
  }
};
