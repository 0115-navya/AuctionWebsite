import express from "express";
import { placeBid } from "../controllers/bid.controller.js";
import {verifyJWT}  from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:auctionId", verifyJWT, placeBid);
export default router;

