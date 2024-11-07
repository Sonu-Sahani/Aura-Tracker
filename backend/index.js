//importing library
import express from 'express'
import env from 'dotenv'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local';
import strategy from './controller/authstragy.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors'

//importing router
import authroute from './router/auth.js'
import profileroute from './router/profile.js'
import assignmentroute from './router/assignment.js'
import assignmentsubmitroute from './router/assignsubmit.js'
import leaderboardroute from './router/leaderboard.js'
import classroute from './router/class.js'
env.config()
const app=express()


app.set('view engine', 'ejs');  // Using EJS as the templating engine
app.set('views','../frontend/views');
//middlewares
//serving static file
app.use(express.static('../frontend/public'))


app.use(cors({
    origin: 'http://localhost:4000', 
    credentials: true,
  }));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:1000*60*30}
}))

app.use(passport.initialize())
app.use(passport.session())
app.get('/test-redirect', (req, res) => {
    res.redirect('http://localhost:3000/auth/login');
});





//routes
//authentication routes
app.use('/auth',authroute)
app.use('/profile',profileroute)
app.use('/assignment',assignmentroute)
app.use('/api',assignmentsubmitroute)
app.use('/user',leaderboardroute)
app.use('/class',classroute)
//


// app.get('/auth/check', (req, res) => {
//     const flag=req.isAuthenticated()
//     console.log(req.session)
//     console.log(flag)
//     if (flag) {
//         res.json({isAuthenticated:true})
//     } else {
//         res.json({isAuthenticated:false})
//     }
// });






passport.serializeUser((user,done)=>{
    console.log("this user going to serialize",user)
    done(null,user)
})
passport.deserializeUser((user,done)=>{
    done(null,user)
})


passport.use(new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
},
strategy.local
))

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:3000/auth/google/dashboard",
},strategy.google))
//listening to the port
app.listen(process.env.PORT,()=>{
    console.log(`listening at http://localhost:${process.env.PORT}`)
})