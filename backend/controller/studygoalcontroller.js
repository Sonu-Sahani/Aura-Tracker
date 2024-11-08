import db from '../database/db.js'
const getdata=async(req,res)=>{
    if(req.isAuthenticated()){
        if(req.user.profile){
            const result= await db.query('SELECT * FROM study_goals WHERE profile_id=$1',[req.user.profile])
            const data=result.rows
            res.json(data)
        }
    }
}

const postdata=async(req,res)=>{
    console.log('here is study goals',req.body)
    if(req.isAuthenticated()){
        if(req.user.profile){
            const goal=req.body.goal
            const targetDate=req.body.targetDate
            const notes=req.body.notes
            const completed=req.body.completed
            try{
                await db.query('INSERT INTO study_goals (goal,target_date,notes,completed,profile_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',[goal,targetDate,notes,completed,req.user.profile])
               const result=await db.query('SELECT * FROM study_goals WHERE profile_id=$1',[req.user.profile])
               const data=result.rows
               res.json(data)

            }catch(err){
                console.log('error in inserting in studegoals',err)
            }
        
        }
        else{
            console.log('make profile first')
        }
    }
}

const updatedata=async(req,res)=>{
    
}

const deletedata=async(req,res)=>{

}
const study={
    postdata,
    getdata,
    updatedata,
    deletedata
}

export default study