import db from "../database/db.js";
import bcrypt from "bcrypt";
const local = async (username, password, done) => {
  console.log(username);
  try {
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      username,
    ]);

    const user = result.rows[0];

    if (!user) {
      return done(null, false);
    }
    const flag = await bcrypt.compare(password, user.password);
    if (flag) {
      try {
        const result = await db.query(
          "SELECT * FROM user_profile WHERE user_id=$1",
          [user.id]
        );
        const val = result.rows;
        if (val.length > 0) {
          user.profile = val[0].profile_id;
        } else {
          console.log("create your profile");
        }
      } catch (err) {
        console.log("error in fetching profile in local staragy");
      }
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    console.log("error in local stragity");
  }
};
const google = async (accessToken, refreshToken, profile, done) => {
  // console.log(profile)
  try {
    const email = profile.emails[0].value;
    console.log(email);
    const result = await db.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];
    if (user) {
      try {
        const result = await db.query(
          "SELECT * FROM user_profile WHERE user_id=$1",
          [user.id]
        );
        const val = result.rows;
        if (val.length > 0) {
          user.profile = val[0].profile_id;
        } else {
          console.log("create your profile");
        }
      } catch (err) {
        console.log("error in fetching profile in local staragy");
      }
      done(null, user);
    } else {
      try {
        const newuser = await db.query(
          "INSERT INTO users (email,password) VALUES ($1,$2) RETURNING*",
          [email, "google"]
        );
        done(null, newuser.rows[0]);
      } catch (err) {
        console.log("error in google ksd function");
      }
    }
  } catch (err) {
    console.log("error in google function");
  }
};

const Strategy = {
  local,
  google,
};
export default Strategy;
