import db from "../database/db.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single("file");

const getassigment = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const result = await db.query(
        "SELECT year,branch FROM user_profile WHERE user_id=$1",
        [req.user.id]
      );
      const data = result.rows;
      if (data.length > 0) {
        try {
          const currentDate = new Date().toISOString().split("T")[0];
          //Now funtion incluede time also
          const result = await db.query(
            "SELECT id, title, duedate, comments, year, branch FROM uploadedassignment WHERE year = $1 AND branch = $2 AND  TO_DATE(duedate, 'YY-MM-DD')>=NOW()::date",
            [data[0].year, data[0].branch]
          );
          const assignments = result.rows;

          if (assignments.length > 0) {
            let senddata = [];

            for (const assignment of assignments) {
              const submissionResult = await db.query(
                "SELECT * FROM submitassignment WHERE assignment_id = $1 AND profile_id=$2",
                [assignment.id, req.user.profile]
              );

              // Add the assignment to senddata if it has not been submitted
              if (submissionResult.rows.length === 0) {
                senddata.push(assignment);
                console.log(assignment);
              }
            }

            console.log(senddata); // `senddata` now contains only unsubmitted assignments
            res.json(senddata);
          }
        } catch (error) {}
      } else {
        console.log("create your profile");
      }
    }
  } catch (err) {
    console.log("err in getting data for assignment");
  }
};

const viewingassignment = async (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.profile) {
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
    }
  }
};

const postassigmentdata = (req, res) => {
  upload(req, res, async (error) => {
    if (req.isAuthenticated()) {
      try {
        const profile_id = req.user.profile;
        const assignment_id = req.body.assignmentId;
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const submitdate = `${day}-${month}-${year}`;
        const filename = req.file.originalname;
        const data = req.file.buffer;
        await db.query(
          "INSERT INTO submitassignment (profile_id,assignment_id,submitdate,filename,data,completed) VALUES ($1,$2,$3,$4,$5,$6)",
          [profile_id, assignment_id, submitdate, filename, data, true]
        );
        try {
          const result = await db.query(
            "SELECT points FROM user_profile WHERE profile_id=$1",
            [req.user.profile]
          );
          const aura = result.rows[0].points;
          await db.query(
            "UPDATE user_profile SET points = $1 WHERE profile_id=$2",
            [aura + 10, req.user.profile]
          );
        } catch (err) {}
        res.json({ completed: true });
      } catch (err) {
        console.log("error in inserting submitting data");
      }
    }
  });
};

const assign = {
  getassigment,
  viewingassignment,
  postassigmentdata,
};
export default assign;
