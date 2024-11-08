import multer from "multer";
import db from "../database/db.js";
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single("pdf");

//

const getUploadpage = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM uploadedassignment");
    const pdfFiles = result.rows;
    res.render("uploadpdf", { pdfFiles: pdfFiles });
  } catch (err) {
    console.log("Error in getting upload data");
  }
};

const postUploadData = async (req, res) => {
  upload(req, res, async (error) => {
    const title = req.body.title;
    const dueDate = req.body.dueDate;
    const year = req.body.year;
    const branch = req.body.branch;
    const comments = req.body.comments;
    const filename = req.file.originalname;
    const Data = req.file.buffer;
    try {
      await db.query(
        "INSERT INTO uploadedassignment (title,dueDate,comments,filename,data,year,branch) VALUES($1,$2,$3,$4,$5,$6,$7)",
        [title, dueDate, comments, filename, Data, year, branch]
      );
      res.redirect("/assignment/upload");
    } catch (err) {
      console.log("Here error is ocuuring to upload");
    }
  });
};

const download = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(
      "SELECT filename,data FROM uploadedassignment WHERE id=$1",
      [id]
    );
    const arr = result.rows;
    if (arr.length > 0) {
      res.setHeader(
        "Content-Disposition",
        `attachment filename=${arr[0].filename}`
      );
      res.send(arr[0].data);
    } else {
      res.send("File not found");
    }
  } catch (err) {
    console.log("downloading uploaded assignment");
  }
};

const view = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(
      "SELECT filename, data FROM uploadedassignment WHERE id = $1",
      [id]
    );
    const arr = result.rows;

    if (arr.length > 0) {
      res.setHeader("Content-Type", "application/pdf"); // Set content type to PDF
      res.setHeader(
        "Content-Disposition",
        `inline filename=${arr[0].filename}`
      ); //
      res.send(arr[0].data); // Send PDF data to display in browser
    } else {
      res.send("File not found");
    }
  } catch (err) {
    console.log("Error displaying uploaded assignment:");
  }
};
const assign = {
  getUploadpage,
  postUploadData,
  download,
  view,
};

export default assign;
