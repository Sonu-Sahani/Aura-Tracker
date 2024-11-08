import express from "express";
import profile from "../controller/profilecontroller.js";

const router = express.Router();

router.post("/submit", profile.profileDataSubmit);
router.post("/update", profile.profileupdate);
// router.get('/get',)
router.get("/get", profile.profileDataGet);
router.get("/userdata", profile.getname);
export default router;
