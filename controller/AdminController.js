const CustomerModal = require('../modal/CustomerModal');
const bcrypt = require('bcrypt');
const TransactionModal = require('../modal/transactionmodal')
const multipleDocumentModal = require('../modal/multipleDocumentModal')

const customerlist = async (req, res) => {
    try {
        var customerlist = await CustomerModal.find({})
        return res.status(200).json({
            "success": true,
            "customers": customerlist,
            "msg": "Get Customer List Successfully"
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "error": error
        })
    }
}

const customer = async (req, res) => {
    const { id } = req.query 
    console.log(id)
    try {
        var customer = await CustomerModal.findById({_id:id})
        return res.status(200).json({
            "success": true,
            "record": customer
        })
    } catch (error) {
        return res.status(400).json({
            "success": false,
            "error": error
        })
    }
}

const fetchtransactions = async (req,res)=>{
   try {
    var transactions = await TransactionModal.find({})
    res.status(200).json({
        success: true,
        history: transactions,
    })
   } catch (error) {
    res.status(400).json({
        success: false,
        history: "transaction history not found"
    })
   } 
}

const fetchMultipleDocument = async (req, res) => {
    try {
        var fetchdocs = await multipleDocumentModal.find({})
        return res.status(200).json({
            status: true,
            docs: fetchdocs
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

module.exports = {
    customerlist,
    customer,
    fetchtransactions,
    fetchMultipleDocument
}