import express from "express";
import { placeBid } from "../controllers/bid.controller.js";
import {verifJWT}  from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:auctionId", verifJWT, placeBid);
export default router;
