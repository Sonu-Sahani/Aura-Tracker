import express from 'express'
import assign  from '../controller/assingmsubmitcontroller.js'
const router=express.Router()
router.get('/assignments',assign.getassigment)
router.get('/assignments/view/:id',assign.viewingassignment)
router.post('/assignments/upload',assign.postassigmentdata)
export default router