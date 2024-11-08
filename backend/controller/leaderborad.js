import db from "../database/db.js";
const getdata = async (req, res) => {
  const result = await db.query(
    "SELECT profile_id,student_name,user_id,points FROM user_profile"
  );
  const data = result.rows;
  res.json(data);
};

const leaderboard = {
  getdata,
};

export default leaderboard;
