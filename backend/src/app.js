import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded( ))
app.use(express.static("public"))
app.use(cookieParser())

/*app.get("/", (req, res) => {
  res.send("Flash Auction API is running");
});*/
import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter)
import auctionRoutes from "./routes/auction.routes.js";

app.use("/api/v1/auctions", auctionRoutes);

import bidRoutes from "./routes/bid.routes.js";

app.use("/api/v1/bids", bidRoutes);



export {app}