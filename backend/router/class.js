import express from "express";
import cl from "../controller/classcontroller.js";
const router = express.Router();
router.get("/routine", cl.getclass);

export default router;
