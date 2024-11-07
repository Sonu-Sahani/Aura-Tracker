import db from '../database/db.js'
//profile data submmit 
const profileDataSubmit=async(req,res)=>{
    
        console.log(req.session)
        const flag=req.isAuthenticated()
        if(flag){
            // console.log(req.body)
            const profile_id=req.body.registrationNo
            const student_name=req.body.fullName
            const user_id=req.user.id
            const gender=req.body.gender
            const year=req.body.year
            const branch=req.body.branch
            const contact=req.body.contact
            const email=req.body.email
            const profile_picture_url="/sjkfsjkks"
            try{
                const result=await db.query('INSERT INTO user_profile (profile_id,student_name,user_id,registration_num,gender,year,branch,contact,email,profile_picture_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[profile_id,student_name,user_id,profile_id,gender,year,branch,contact,email,profile_picture_url])
                req.user.profile=profile_id
                res.json({submitted:true})
            }catch(err){
                console.log("error in inserting data in profile")
                res.json({submitted:false})
            }
        }
        else{
            console.log("HILLoj")
            // res.json({isauthenticated:false})
        }
}

const profileDataGet=async(req,res)=>{
    try{
        if(req.isAuthenticated()){
            const result=await db.query('SELECT * FROM user_profile WHERE user_id=$1',[req.user.id])
            const user=result.rows[0]
            res.json(user)
        }
        // const result=await db.query('SELECT * FROM user_profile WHERE user_id=$1',[req.user.id])
    }catch(err){
        console.log('error in getting profile data from user_profile')
    }
}

const getname=async(req,res)=>{
    if(req.isAuthenticated()){
        const result=await db.query('SELECT student_name,points FROM user_profile WHERE user_id=$1',[req.user.id])
        const data=result.rows[0]
        res.json(data)
    }
}
const profile={
    profileDataSubmit,
    profileDataGet,
    getname
}

export default profile