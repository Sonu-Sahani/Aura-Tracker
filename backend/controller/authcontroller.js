import path from 'path'
import { fileURLToPath } from 'url'
import supabase from '../database/db.js'
import bcrypt from 'bcrypt'
import sendmail from './sendmail.js'

// Define __filename and __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

// HTML file location
const location = path.join(__dirname, '..', '..', 'frontend', 'public', 'html')

const saltrounds = 2

var opt;

const getlogin = (req, res) => {
    res.sendFile(location + '/login.html')
}

const getregister = (req, res) => {
    res.sendFile(location + '/register.html')
}

const postregister = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        // Check if user already exists
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)

        if (userError) throw userError

        if (user.length > 0) {
            res.redirect('/auth/login')
        } else {
            try {
                opt = sendmail.optGenerator()
                await sendmail.sendEmail(opt, email)
                res.render('opt', { email: req.body.email, password: req.body.password })
            } catch (err) {
                console.log("Error sending email in postregister controller:", err)
            }
        }
    } catch (err) {
        console.log("Error in postregister:", err)
    }
}

// Logout
const logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.log("Error in logout:", err)
        } else {
            res.redirect('/auth/login')
        }
    })
}

// Send mail
const postopt = async (req, res) => {
    const receivedOpt = req.body.otp
    if (`${opt}` === receivedOpt) {
        const email = req.body.email
        const password = req.body.password
        try {
            const hashPassword = await bcrypt.hash(password, saltrounds)
            const { data: users, error: insertError } = await supabase
                .from('users')
                .insert([{ email, password: hashPassword }])
                .select() // Get the inserted user

            if (insertError) throw insertError

            const user = users[0]
            req.login(user, (err) => {
                if (err) {
                    console.log("Error in login() after registration:", err)
                } else {
                    res.redirect('http://localhost:4000/Profile')
                }
            })
        } catch (err) {
            console.log("Error in postopt:", err)
        }
    } else {
        res.render('opt', { email: req.body.email, password: req.body.password })
    }
}

const resendopt = async (req, res) => {
    opt = sendmail.optGenerator()
    await sendmail.sendEmail(opt, req.body.email)
    res.render('opt', { email: req.body.email, password: req.body.password })
}

const checkingAuthentication = (req, res) => {
    const flag = req.isAuthenticated()
    console.log('Check authentication', req.session)
    res.json({ isAuthenticated: flag })
}

const authcontroller = {
    getlogin,
    getregister,
    postregister,
    logout,
    postopt,
    resendopt,
    checkingAuthentication
}

export default authcontroller
