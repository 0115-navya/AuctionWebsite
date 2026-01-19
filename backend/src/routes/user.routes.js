import { Router } from "express";
import { registerUser, loginUser, logoutUser,changePassword,getProfile} from "../controllers/user.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/change_password/:userId", verifyJWT, changePassword);



router.get("/profile", verifyJWT, getProfile);


export default router;
