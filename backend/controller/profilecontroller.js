import supabase from '../database/db.js';

// Profile data submission
const profileDataSubmit = async (req, res) => {
    console.log(req.session);
    const flag = req.isAuthenticated();

    if (flag) {
        const profile_id = req.body.registrationNo;
        const student_name = req.body.fullName;
        const user_id = req.user.id;
        const gender = req.body.gender;
        const year = req.body.year;
        const branch = req.body.branch;
        const contact = req.body.contact;
        const email = req.body.email;
        const profile_picture_url = "/sjkfsjkks"; // Replace with actual URL if available

        try {
            const { data, error } = await supabase
                .from('user_profile')
                .insert([{
                    profile_id,
                    student_name,
                    user_id,
                    registration_num: profile_id,
                    gender,
                    year,
                    branch,
                    contact,
                    email,
                    profile_picture_url
                }]);

            if (error) {
                console.log("Error in inserting data in profile:", error);
                return res.json({ submitted: false });
            }

            req.user.profile = profile_id;
            res.json({ submitted: true });
        } catch (err) {
            console.log("Error in inserting data in profile:", err);
            res.json({ submitted: false });
        }
    } else {
        console.log("User is not authenticated");
    }
};

// Profile data retrieval
const profileDataGet = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const { data, error } = await supabase
                .from('user_profile')
                .select('*')
                .eq('user_id', req.user.id)
                .single();

            if (error) {
                console.log('Error in getting profile data from user_profile:', error);
                return res.status(500).json({ error: 'Failed to retrieve profile data' });
            }

            res.json(data);
        }
    } catch (err) {
        console.log('Error in getting profile data from user_profile:', err);
        res.status(500).json({ error: 'An error occurred while retrieving profile data' });
    }
};

// Get student name and points
const getname = async (req, res) => {
    if (req.isAuthenticated()) {
        const { data, error } = await supabase
            .from('user_profile')
            .select('student_name, points')
            .eq('user_id', req.user.id)
            .single();

        if (error) {
            console.log('Error fetching name and points:', error);
            return res.status(500).json({ error: 'Failed to retrieve name and points' });
        }

        res.json(data);
    }
}

const profile = {
    profileDataSubmit,
    profileDataGet,
    getname
}

export default profile;
