import express from 'express'
import authcontroller from '../controller/authcontroller.js'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
const router=express.Router()

//get user login page
router.get('/login',authcontroller.getlogin)

//get user register page
router.get('/register',authcontroller.getregister)

//posting via login page
router.post("/login",passport.authenticate('local',{failureRedirect:"/auth/login"}),(req,res)=>{
    // console.log('/login',req.session)
    if(req.isAuthenticated()){
      if(req.user.profile){
        res.redirect('http://localhost:4000')
      }
      else{
        res.redirect('http://localhost:4000/Profile')
      }
    }
    
})
//posting via register page
router.post('/register',authcontroller.postregister)

//logout

router.get('/logout',authcontroller.logout)

//post opt
router.post('/opt',authcontroller.postopt)
router.post('/resendopt',authcontroller.resendopt)


//google authentication routes

router.get('/google',
    passport.authenticate('google', { scope: ['profile','email'],prompt:'consent select_account' }))
  
  router.get('/google/dashboard', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      if(req.isAuthenticated()){
        if(req.user.profile){
          res.redirect('http://localhost:4000')
        }
        else{
          res.redirect('http://localhost:4000/Profile')
        }
      }
    });



//checking authentication route

router.get('/check',authcontroller.checkingAuthentication)
export default router
