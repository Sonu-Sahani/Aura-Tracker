import supabase from '../database/db.js'

const getclass = async (req, res) => {
    try {
        const today = req.query.day;
        console.log(today);

        // Fetch the schedule for the specified day
        const { data, error } = await supabase
            .from('schedule')
            .select('*')
            .eq('day', today);

        if (error) {
            console.log("Error in fetching schedule data:", error);
            return res.status(500).json({ error: 'Failed to fetch schedule data' });
        }

        if (req.isAuthenticated()) {
            if (req.user.profile) {
                return res.json(data);
            }
        }
    } catch (err) {
        console.log("Error in fetching data:", err);
        res.status(500).json({ error: 'An error occurred while fetching class schedule' });
    }
}

const cl = {
    getclass
}

export default cl;
// uC*gWmShknMYS3h