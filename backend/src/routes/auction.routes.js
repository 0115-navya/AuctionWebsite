import express from "express";
import { verifyJWT, adminOnly } from "../middlewares/auth.middleware.js";

import {
  createAuction,
  getAllAuctions,
} from "../controllers/auction.controller.js";


const router = express.Router();

// Public route
router.get("/", getAllAuctions);

// Admin-only route
router.post("/create", verifyJWT, adminOnly, createAuction);


export default router;
