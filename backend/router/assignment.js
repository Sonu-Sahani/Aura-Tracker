import express from "express";
import assign from "../controller/assigncontroller.js";

const router = express.Router();

router.get("/upload", assign.getUploadpage);
router.post("/upload", assign.postUploadData);
router.get("/pdfs/:id/download", assign.download);
router.get("/pdfs/:id/view", assign.view);
export default router;
