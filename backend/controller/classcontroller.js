import db from "../database/db.js";
const getclass = async (req, res) => {
  try {
    const today = req.query.day;
    console.log(today);
    const result = await db.query("SELECT * FROM schedule WHERE day=$1", [
      today,
    ]);
    const data = result.rows;
    if (req.isAuthenticated()) {
      if (req.user.profile) {
        res.json(data);
      }
    }
  } catch (err) {
    console.log("Error in fetching data");
  }
};

const cl = {
  getclass,
};

export default cl;

// uC*gWmShknMYS3h
