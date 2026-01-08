import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import {verifJWT} from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);


router.get("/profile", verifJWT, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed",
    user: req.user,
  });
});


export default router;
