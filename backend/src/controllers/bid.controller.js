import {Auction} from "../models/auction.models.js";
import {Bid} from "../models/bid.model.js";
import { getAuctionStatus } from "../utils/actionStatus.js";

export const placeBid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    const status = getAuctionStatus(
      auction.startTime,
      auction.endTime
    );

    if (status !== "live") {
      return res.status(400).json({ message: "Auction is not live" });
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
      .sort({ amount: -1 });
    return res.status(200).json(bids);
    } catch (error) {
    return res.status(500).json({ message: "Server error" });
    }
};
