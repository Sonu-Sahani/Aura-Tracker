import multer from 'multer'
import supabase from '../database/db.js'

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }
}).single("pdf")

const getUploadpage = async (req, res) => {
    try {
        const { data: pdfFiles, error } = await supabase
            .from('uploadedassignment')
            .select('*')

        if (error) throw error

        res.render('uploadpdf', { pdfFiles: pdfFiles })
    } catch (err) {
        console.log("Error in getting upload data:", err.message)
        res.status(500).send('Internal Server Error')
    }
}

const postUploadData = async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log("Multer error:", error.message)
            return res.status(400).send('Error uploading file')
        }

        const title = req.body.title
        const dueDate = req.body.dueDate
        const year = req.body.year
        const branch = req.body.branch
        const comments = req.body.comments
        const filename = req.file.originalname
        const Data = req.file.buffer

        try {
            const { error } = await supabase
                .from('uploadedassignment')
                .insert([{ title, duedate:dueDate, comments, filename, data: Data, year, branch }])

            if (error) throw error
            
            res.redirect('/assignment/upload')
        } catch (err) {
            console.log("Error uploading:", err.message)
            res.status(500).send('Internal Server Error')
        }
    })
}

const download = async (req, res) => {
    try {
        const id = req.params.id
        const { data: arr, error } = await supabase
            .from('uploadedassignment')
            .select('filename, data')
            .eq('id', id)

        if (error) throw error

        if (arr.length > 0) {
            res.setHeader('Content-Disposition', `attachment; filename=${arr[0].filename}`)
            res.send(arr[0].data)
        } else {
            res.send('File not found')
        }
    } catch (err) {
        console.log('Error downloading uploaded assignment:', err.message)
        res.status(500).send('Internal Server Error')
    }
}

const view = async (req, res) => {
    try {
        const id = req.params.id
        const { data: arr, error } = await supabase
            .from('uploadedassignment')
            .select('filename, data')
            .eq('id', id)

        if (error) throw error

        if (arr.length > 0) {
            res.setHeader('Content-Type', 'application/pdf')
            res.setHeader('Content-Disposition', `inline; filename=${arr[0].filename}`)
            res.send(arr[0].data)
        } else {
            res.send('File not found')
        }
    } catch (err) {
        console.log('Error displaying uploaded assignment:', err.message)
        res.status(500).send('Internal Server Error')
    }
}

const assign = {
    getUploadpage,
    postUploadData,
    download,
    view
}

export default assign
