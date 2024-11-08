import pg from "pg";
import env from "dotenv";
env.config();
const db = new pg.Client({
  user: process.env.USER,
  host: "localhost",
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DATABASE_PORT,
});

db.connect(() => {
  console.log("data base is succesfully connected");
});
export default db;
