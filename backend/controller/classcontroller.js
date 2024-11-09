import db from "../database/db.js";
const getclass = async (req, res) => {
  try {
    const today = req.query.day;
    // console.log(today);
    // const result = await db.query("SELECT * FROM schedule WHERE day=$1", [
    //   today,
    // ]);
    // const data = result.rows;
    // if (req.isAuthenticated()) {
    //   if (req.user.profile) {
    //     res.json(data);
    //   }
    // }
    if(req.isAuthenticated()){
        const result=await db.query('SELECT branch,year,section FROM user_profile WHERE profile_id=$1',[req.user.profile])
        const value=result.rows
        if(value.length>0){
            const result=await db.query('SELECT * FROM schedule WHERE day=$1 AND year=$2 AND branch=$3 AND section=$4',[today,value[0].year,value[0].branch,value[0].section])
            const data=result.rows
            res.json(data)
        }else{
          console.log('create profile')
        }
    }


  } catch (err) {
    console.log("Error in fetching data",err);
  }
};

const cl = {
  getclass,
};

export default cl;

// uC*gWmShknMYS3h
