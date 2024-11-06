import supabase from '../database/db.js'
import multer from 'multer'

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single("file")

const getassigment = async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            const { data, error: profileError } = await supabase
                .from('user_profile')
                .select('year, branch')
                .eq('user_id', req.user.id)

            if (profileError) throw profileError

            const userData = data;

            if (userData.length > 0) {
                try {
                    const currentDate = new Date().toISOString().split('T')[0];

                    const { data: assignments, error: assignmentError } = await supabase
                        .from('uploadedassignment')
                        .select('id, title, duedate, comments, year, branch')
                        .eq('year', userData[0].year)
                        .eq('branch', userData[0].branch)
                        .gte('duedate', currentDate) // Ensure due date is greater than or equal to today

                    if (assignmentError) throw assignmentError

                    if (assignments.length > 0) {
                        let senddata = [];

                        for (const assignment of assignments) {
                            const { data: submissionData, error: submissionError } = await supabase
                                .from('submitassignment')
                                .select('*')
                                .eq('assignment_id', assignment.id)
                                .eq('profile_id', req.user.profile)

                            if (submissionError) throw submissionError

                            // Add the assignment to senddata if it has not been submitted
                            if (submissionData.length === 0) {
                                senddata.push(assignment);
                            }
                        }

                        res.json(senddata); // `senddata` now contains only unsubmitted assignments
                    }
                } catch (error) {
                    console.log('Error fetching assignments:', error.message)
                    res.status(500).send('Internal Server Error')
                }
            } else {
                console.log("create your profile")
                res.status(404).send('Profile not found')
            }
        }
    } catch (err) {
        console.log('Error in getting data for assignment:', err.message)
        res.status(500).send('Internal Server Error')
    }
}

const viewingassignment = async (req, res) => {
    if (req.isAuthenticated()) {
        if (req.user.profile) {
            try {
                const id = req.params.id
                const { data: arr, error } = await supabase
                    .from('uploadedassignment')
                    .select('filename, data')
                    .eq('id', id)

                if (error) throw error

                if (arr.length > 0) {
                    res.setHeader('Content-Type', 'application/pdf') // Set content type to PDF
                    res.setHeader('Content-Disposition', `inline; filename=${arr[0].filename}`)
                    res.send(arr[0].data) // Send PDF data to display in browser
                } else {
                    res.send('File not found')
                }
            } catch (err) {
                console.log('Error displaying uploaded assignment:', err.message)
                res.status(500).send('Internal Server Error')
            }
        }
    }
}

const postassigmentdata = (req, res) => {
    upload(req, res, async (error) => {
        if (req.isAuthenticated()) {
            try {
                const profile_id = req.user.profile
                const assignment_id = req.body.assignmentId
                const submitdate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
                const filename = req.file.originalname
                const data = req.file.buffer

                const { error: insertError } = await supabase
                    .from('submitassignment')
                    .insert([{ profile_id, assignment_id, submitdate, filename, data, completed: true }])

                if (insertError) throw insertError

                try {
                    const { data: userData, error: pointsError } = await supabase
                        .from('user_profile')
                        .select('points')
                        .eq('profile_id', req.user.profile)

                    if (pointsError) throw pointsError

                    const aura = userData[0].points
                    await supabase
                        .from('user_profile')
                        .update({ points: aura + 10 })
                        .eq('profile_id', req.user.profile)

                } catch (err) {
                    console.log('Error updating points:', err.message)
                }

                res.json({ completed: true })
            } catch (err) {
                console.log('Error in inserting submitting data:', err.message)
                res.status(500).send('Internal Server Error')
            }
        }
    })
}

const assign = {
    getassigment,
    viewingassignment,
    postassigmentdata
}

export default assign
