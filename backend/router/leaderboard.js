import express from "express";
import leaderboard from "../controller/leaderborad.js";
const router = express.Router();

router.get("/leaderboard", leaderboard.getdata);
export default router;
