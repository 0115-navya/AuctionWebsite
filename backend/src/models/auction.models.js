import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      default: 0,
    },
    status:{
      type: String,
      enum: ['upcoming', 'live', 'ended'],
      default: 'upcoming'
    },

    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    winner:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, 
    
    highestBid: {
      type: Number,
      default: 0,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
   
    
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Auction = mongoose.model("Auction", auctionSchema);
