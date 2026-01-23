import express from "express";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";
import { createAuction, getAllAuctions,getAuctionById,updateAuction,deleteAuction,getAuctionDetails} from "../controllers/auction.controller.js";


const router = express.Router();

// Admin-only route
router.post("/create", verifyJWT, adminOnly, createAuction);

// Public route
router.get("/", getAllAuctions);

router.get("/:id", getAuctionById);
router.put("/:id", verifyJWT, adminOnly, updateAuction);
router.delete("/:id", verifyJWT, adminOnly, deleteAuction);
router.get("/:auctionId/details", getAuctionDetails);


export default router;