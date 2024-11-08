import express from 'express'
import goals from '../controller/studygoalcontroller.js'
const router=express()

router.get('/goals',goals.getdata)
router.post('/goals',goals.postdata)
router.put('/goals',goals.updatedata)
router.delete('/goals',goals.deletedata)

export default router