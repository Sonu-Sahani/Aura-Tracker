import path from "path";
import { fileURLToPath } from "url";
import db from "../database/db.js";
import bcrypt from "bcrypt";
import sendmail from "./sendmail.js";
import passport from "passport";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const location = path.join(__dirname, "..", "..", "frontend", "public", "html");

const saltrounds = 2;
let otpData = {}; // Store OTP and timestamp

const getlogin = (req, res) => {
  res.sendFile(location + "/login.html");
};

const getregister = (req, res) => {
  res.sendFile(location + "/register.html");
};

const postregister = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const result = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows;

    if (user.length > 0) {
      res.redirect("/auth/login");
    } else {
      try {
        const otp = sendmail.optGenerator();
        const otpTimestamp = Date.now(); // Store generation time
        otpData[email] = { otp, otpTimestamp };

        sendmail.sendEmail(otp, email);
        res.render("opt", { email, password });
      } catch (err) {
        console.log("Error inserting data in postregister controller", err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

// Logout
const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Error in logout");
    } else {
      res.redirect("/auth/login");
    }
  });
};

// OTP verification with expiration
const postopt = async (req, res) => {
  const receivedOtp = req.body.otp;
  const email = req.body.email;
  const password = req.body.password;
  
  // Check if OTP and timestamp exist for the email
  if (otpData[email]) {
    const { otp, otpTimestamp } = otpData[email];
    const currentTime = Date.now();
    const isExpired = currentTime - otpTimestamp > 2 * 60 * 1000; // 10 minutes

    if (isExpired) {
      console.log("OTP has expired.");
      delete otpData[email];
      res.render("opt", { email, password, error: "OTP expired, please request a new one." });
    } else if (`${otp}` === receivedOtp) {
      try {
        const hashPassword = await bcrypt.hash(password, saltrounds);
        const users = await db.query(
          "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
          [email, hashPassword]
        );
        const user = users.rows[0];

        req.login(user, (err) => {
          if (err) {
            console.log("Error in login");
          } else {
            res.redirect("http://localhost:4000/Profile");
          }
        });
        delete otpData[email]; // Clean up after successful validation
      } catch (err) {
        console.log("Error while inserting user into database", err);
      }
    } else {
      res.render("opt", { email, password, error: "Invalid OTP. Please try again." });
    }
  } else {
    res.render("opt", { email, password, error: "OTP expired or invalid." });
  }
};

// Resend OTP with new timestamp
const resendopt = (req, res) => {
  const email = req.body.email;
  const otp = sendmail.optGenerator();
  const otpTimestamp = Date.now();
  otpData[email] = { otp, otpTimestamp }; // Update OTP and timestamp

  sendmail.sendEmail(otp, email);
  res.render("opt", { email, password: req.body.password });
};

const checkingAuthentication = (req, res) => {
  const flag = req.isAuthenticated();
  res.json({ isAuthenticated: flag });
};

const authcontroller = {
  getlogin,
  getregister,
  postregister,
  logout,
  postopt,
  resendopt,
  checkingAuthentication,
};

export default authcontroller;
