import express from "express";
import { verifJWT, adminOnly } from "../middlewares/auth.middleware.js";

import {
  createAuction,
  getAllAuctions,
} from "../controllers/auction.controller.js";


const router = express.Router();

// Public route
router.get("/", getAllAuctions);

// Admin-only route
router.post("/create", verifJWT, adminOnly, createAuction);


export default router;
