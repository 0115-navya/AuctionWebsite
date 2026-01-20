import express from "express";
import { placeBid , getBidsForAuction ,closeAuction}  from "../controllers/bid.controller.js";
import {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:auctionId", verifyJWT, placeBid);
router.get("/:auctionId", verifyJWT, getBidsForAuction);
router.post("/:auctionId/close", verifyJWT, closeAuction);
export default router;

