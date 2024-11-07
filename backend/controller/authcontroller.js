import path from 'path'
import { fileURLToPath } from 'url'
import db from '../database/db.js'
import bcrypt from 'bcrypt'
import sendmail from './sendmail.js'
import { read } from 'fs'
import passport from 'passport'
// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

//html file location
const location=path.join(__dirname,'..','..','frontend','public','html')


const saltrounds=2

var opt;

const getlogin=(req,res)=>{
    res.sendFile(location+'/login.html')
}


const getregister=(req,res)=>{
    res.sendFile(location+'/register.html')
}


const postregister=async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const result=await db.query('SELECT * FROM users WHERE email=$1',[email])
        const user=result.rows
        if(user.length>0){
            res.redirect('/auth/login')
        }
        else{
            try{
               
                // console.log(hashpassword)
                opt=sendmail.optGenerator()
                sendmail.sendEmail(opt,email)
                res.render('opt',{email:req.body.email,password:req.body.password})
            }
            catch(err){
                console.log("error occuring inserting in data base in postregister controller")
            }
        }
        

        
    }catch(err){
        console.log(err)
    }
}



//logout

const logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log("Error in logout")
            
        }
        else{
            res.redirect('/auth/login')
        }
    })
}


//send mail
const postopt=async(req,res)=>{
    const recivedopt=req.body.otp
    // console.log(opt,recivedopt)
    if(`${opt}`==recivedopt){
        const email=req.body.email
        const password=req.body.password
        try{
            const hashpassword=await bcrypt.hash(password,saltrounds)
            const users=await db.query('INSERT INTO users (email,password) VALUES ($1,$2) RETURNING*',[email,hashpassword])
            const user=users.rows[0]
            req.login(user,(err)=>{
                if(err){
                    console.log("err in login()")
                }
                else{
                    res.redirect('http://localhost:4000/Profile')
                }
            })
        }
        catch(err){
            console.log("here is error")
        }
    }
    else{
        res.render('opt',{email:req.body.email,password:req.body.password})
    }

}

const resendopt=(req,res)=>{
    opt=sendmail.optGenerator()
    sendmail.sendEmail(opt,req.body.email)
    res.render('opt',{email:req.body.email,password:req.body.password})
}


const checkingAuthentication=(req,res)=>{
    const flag=req.isAuthenticated()
    console.log('check authentication',req.session)
    // console.log(flag)
    if (flag) {
        res.json({isAuthenticated:true})
    } else {
        res.json({isAuthenticated:false})
    }
}
const authcontroller={
    getlogin,
    getregister,
    postregister,
    logout,
    postopt,
    resendopt,
    checkingAuthentication
}

export default authcontroller