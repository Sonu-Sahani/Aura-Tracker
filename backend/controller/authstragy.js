import supabase from '../database/db.js'
import bcrypt from 'bcrypt'

const local = async (username, password, done) => {
    console.log(username)
    try {
        // Fetch the user by email
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', username)
            .single() // Get single user

        if (userError) {
            console.log('Error fetching user:', userError)
            return done(null, false)
        }

        if (!user) {
            return done(null, false)
        }

        const flag = await bcrypt.compare(password, user.password)
        if (flag) {
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('user_profile')
                    .select('*')
                    .eq('user_id', user.id)
                    .single() // Get single profile

                if (profileError) {
                    console.log('Error fetching profile in local strategy:', profileError)
                } else if (profile) {
                    user.profile = profile.profile_id
                } else {
                    console.log('Create your profile')
                }
            } catch (err) {
                console.log('Error in fetching profile in local strategy:', err)
            }
            return done(null, user)
        } else {
            return done(null, false)
        }
    } catch (err) {
        console.log('Error in local strategy:', err)
    }
}

const google = async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value
        console.log(email)
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single() // Get single user

        if (userError) {
            console.log('Error fetching user:', userError)
        }

        if (user) {
            try {
                const { data: profile, error: profileError } = await supabase
                    .from('user_profile')
                    .select('*')
                    .eq('user_id', user.id)
                    .single() // Get single profile

                if (profileError) {
                    console.log('Error fetching profile in Google strategy:', profileError)
                } else if (profile) {
                    user.profile = profile.profile_id
                } else {
                    console.log('Create your profile')
                }
            } catch (err) {
                console.log('Error in fetching profile in Google strategy:', err)
            }
            done(null, user)
        } else {
            try {
                // Create a new user with a placeholder password
                const { data: newUser, error: insertError } = await supabase
                    .from('users')
                    .insert([{ email, password: 'google' }])
                    .select() // Get the inserted user

                if (insertError) {
                    console.log('Error creating new user in Google strategy:', insertError)
                    return done(null, false)
                }

                done(null, newUser[0]) // Return the new user
            } catch (err) {
                console.log('Error in Google strategy:', err)
            }
        }
    } catch (err) {
        console.log('Error in Google function:', err)
    }
}

const Strategy = {
    local,
    google
}

export default Strategy
