const express = require('express');
const imgUpload = require('../modal/ImgUpload')
const multipleimgupload = require('../modal/multipleimgupload')
const customerController = require('../controller/CustomerController');
const authMiddleware = require('../middleware/auth-middleware')
var router = express.Router()


//middleware route
// router.use(authMiddleware)

//routing
router.put('/editprofile', customerController.editProfile)
router.put('/withdraw',customerController.withdrawAmt)
router.put('/deposit',customerController.depositAmt)
router.get('/transactionhistory',customerController.transactionHistory)
router.post('/uploaddocument',imgUpload.single("upload_doc"),customerController.uploadDocument)
router.post('/uploadmultiple',multipleimgupload.array("upload_doc",12),customerController.multipleUploadDocument)
router.get('/fetchmultipledoc',customerController.fetchMultipleDocument)

router.post('/fixeddeposit',customerController.createFD)
router.post('/updatebalance',customerController.updateSalary)


module.exports = router