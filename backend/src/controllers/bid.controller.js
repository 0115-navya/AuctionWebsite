import {Auction} from "../models/auction.models.js";
import {Bid} from "../models/bid.model.js";
import { getAuctionStatus } from "../utils/actionStatus.js";


export const placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const status = getAuctionStatus(auction.startTime, auction.endTime);
    if (status !== "live") {
      return res.status(400).json({ message: `Auction is ${status} not live` });
    }

    if (amount <= auction.currentPrice) {
      return res
        .status(400)
        .json({ message: "Bid must be higher than current price" });
    }

    const bid = await Bid.create({
      auction: auctionId,
      bidder: req.user._id,
      amount,
    });

    auction.currentPrice = amount;
    auction.highestBidder = req.user._id;
    await auction.save();

    return res.status(201).json({
      message: "Bid placed successfully",
      bid,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
export const getBidsForAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const bids = await Bid.find({ auction: auctionId })
      .populate("bidder", "username email")
      .sort({ amount: -1 , createdAt: -1 });
    return res.status(200)
    .json({
      count:bids.length,
      bids,
    }); 
    } catch (error) {
    return res.status(500).json({ message: "Server error" });
    }
};
export const closeAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId)
    
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.status === "ended") {
      return res.status(400).json({ message: "Auction already closed" });
    }
    const highestBid = await Bid.findOne({ auction: auctionId })
      .sort({ amount: -1 })
      .populate("bidder", "name email");

    auction.status = "ended";

    if (highestBid) {
      auction.winner = highestBid.bidder._id;
      auction.highestBid = highestBid.amount;
      
    }

    await auction.save();

    return res.status(200).json({
      message: "Auction closed successfully",
      winner: highestBid
        ? {
            id: highestBid.bidder._id,
            name: highestBid.bidder.name,
            email: highestBid.bidder.email,
            amount: highestBid.amount,
          }
        : null,
    });
  } catch (error) {
    console.error("close auction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
