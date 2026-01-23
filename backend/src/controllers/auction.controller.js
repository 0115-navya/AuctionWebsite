import { Auction } from "../models/auction.models.js";
import { getAuctionStatus } from "../utils/actionStatus.js";
import { Bid } from "../models/bid.model.js";

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
    const { status:statusQuery, page = 1, limit = 10 } = req.query;
    const auctions = await Auction.find()
      .populate("createdBy", "username email role")
      .populate("winner","name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const updatedAuctions = auctions
      .map((auction) => {
        const status = getAuctionStatus(auction.startTime, auction.endTime);

        return {
          ...auction.toObject(),
          status,
        };
      })
      const filteredAuctions = statusQuery
      ? updatedAuctions.filter(
          (auction) => auction.status === statusQuery,
        )
      : updatedAuctions;
    return res
      .status(200)
      .json({ count: filteredAuctions.length, auctions: filteredAuctions });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAuctionById = async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id)
      .populate("createdBy", "name email role")
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
      return res.status(400).json({ message: "Cannot update ended auction" });
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
export const getAuctionDetails = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId).populate(
      "createdBy",
      "name email",
    );

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const bids = await Bid.find({ auction: auctionId })
      .populate("bidder", "name email")
      .sort({ amount: -1 });

    res.status(200).json({
      auction,
      bids,
      totalBids: bids.length,
    });
  } catch (error) {
    console.error("get auction details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
