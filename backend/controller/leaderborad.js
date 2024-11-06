import supabase from '../database/db.js'

const getdata = async (req, res) => {
    try {
        // Fetch leaderboard data
        const { data, error } = await supabase
            .from('user_profile')
            .select('profile_id, student_name, user_id, points');

        if (error) {
            console.log("Error in fetching leaderboard data:", error);
            return res.status(500).json({ error: 'Failed to fetch leaderboard data' });
        }

        res.json(data);
    } catch (err) {
        console.log("Error in fetching data:", err);
        res.status(500).json({ error: 'An error occurred while fetching leaderboard data' });
    }
}

const leaderboard = {
    getdata
}

export default leaderboard;
