const CustomerModal = require("../modal/CustomerModal")
const DocumentModal = require("../modal/DocumentModal")
const multipleDocumentModal = require("../modal/multipleDocumentModal")
const FDModal = require('../modal/fdmodal')
const ObjectId = require('mongodb').ObjectId;
const transactionModal = require('../modal/transactionmodal')
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' })

const crypto = require('crypto');

const withdrawAmt = async (req, res) => {
    const { id } = req.query
   
    console.log(Id)
    const { amount, email, accno } = req.body
    try {
        var customer = await CustomerModal.findOne({ email })
        console.log(customer)
        if (customer != null) {
            if (customer.accno === accno) {
                var result = await CustomerModal.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        accno: accno,
                        balance: customer.balance - amount
                    }
                }, {
                    new: true,
                    useFindAndModify: false
                })
                const transaction = new transactionModal({
                    customer_id: id,
                    amount: amount,
                    balance_before_transaction: customer.balance,
                    balance_after_transaction: customer.balance - amount,
                    transaction_type: "withdraw",
                });
                await transaction.save();
                res.status(200).json({
                    success: true,
                    record: result,
                    "msg": "Withdraw Amount Successfully"
                })
            } else {
                return res.status(400).json({
                    status: false,
                    msg: "AccNo is InValid"
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                msg: "Email is InValid"
            })
        }


    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Balance not updated"
        })
    }

}
const depositAmt = async (req, res) => {
    const { id } = req.query
    console.log("get id:===>", id)
    const Id = new ObjectId(id)
    console.log(Id)
    const { amount, email, accno } = req.body
    try {
        const customer = await CustomerModal.findOne({ email })
        console.log(customer)

        if (customer != null) {
            if (customer.accno === accno) {
                var result = await CustomerModal.findByIdAndUpdate({
                    _id: id
                }, {
                    $set: {
                        accno: accno,
                        balance: customer.balance + amount
                    }
                }, {
                    new: true,
                    useFindAndModify: false
                })
                const transaction = new transactionModal({
                    customer_id: id,
                    amount: amount,
                    balance_before_transaction: customer.balance,
                    balance_after_transaction: customer.balance + amount,
                    transaction_type: "deposit",
                });
                await transaction.save();
                res.status(200).json({
                    success: true,
                    record: result,
                    "msg": "Amount Deposit Successfully"
                })
            } else {
                return res.status(400).json({
                    status: false,
                    msg: "AccNo is InValid"
                })
            }
        } else {
            return res.status(400).json({
                status: false,
                msg: "Email is InValid"
            })
        }


    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "balance not updated"
        })
    }

}
const transactionHistory = async (req, res) => {
    const { id } = req.query
    console.log("get id:===>", id)
    try {
        var transactions = await transactionModal.find({ customer_id: id })
        console.log(transactions)
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
const uploadDocument = async (req, res) => {
    const { id } = req.query
    const { doc_name } = req.body
    const upload_doc = req.file.path
    console.log(id, doc_name, upload_doc)
    try {
        const uploaddata = new DocumentModal({
            doc_name,
            upload_doc: `http://localhost:${process.env.PORTNO}/` + upload_doc,
            customer_id: id
        })
        await uploaddata.save()
        return res.status(200).json({
            success: true,
            post: uploaddata
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error,
            msg: "Image Not Uploaded!!"
        })
    }

}
const multipleUploadDocument = async (req, res) => {
    const { id } = req.query
    const { doc_name } = req.body
    const upload_doc = req.files
    console.log(doc_name)
    console.log(upload_doc)
    console.log(id)

    var newdoc = upload_doc.map((data) => {
        return {
            type: data.mimetype,
            name: data.filename,
            path: `http://localhost:${process.env.PORTNO}/` +
                data.path,
            size: data.size
        }
    })
    console.log("New Data:", newdoc)
    try {
        const uploaddata = new multipleDocumentModal({
            doc_name,
            upload_doc: newdoc,
            customer_id: id
        })
        console.log(uploaddata)
        await uploaddata.save()
        return res.status(200).json({
            success: true,
            post: uploaddata
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Images Not Uploaded!!"
        })
    }
}
const fetchMultipleDocument = async (req, res) => {
    const { id } = req.query
    try {
        var fetchdocs = await multipleDocumentModal.find({ customer_id: id })
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
const editProfile = async (req, res) => {
    const { id } = req.query
    const { name, mobile, gender, city, state, pincode } = req.body
    console.log(req.body)
    try {
        const updatedDetails = await CustomerModal.findByIdAndUpdate(
            { _id: id },
            {
                $set: {
                    name: name, 
                    mobile: mobile, 
                    address:{
                        city: city, 
                        state: state, 
                        pincode: pincode
                    },
                    gender: gender,
                }
            }, {
                new: true,
            newFindAndModify: false
        })

        console.log(updatedDetails)
        return res.status(200).json({
            success: true,
            msg: "Customer Record Updated Successfully !",
            record: updatedDetails
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "User Record Not Updated!",
            Error: error
        })
    }
}
const createFD = async (req, res) => {
    const { id } = req.query
    const { fd_amount, email, fd_duration } = req.body
    var customer = await CustomerModal.findOne({ email })
    console.log(customer)
    try {
        var fd = new FDModal({
            customer_id: id,
            accno: crypto.randomInt(1000000, 9999999),
            fd_amount: fd_amount,
            balance_after_creating_fd: customer.balance - fd_amount,
            fd_duration: fd_duration,
            interestAmount: ((fd_amount * 7.1) / 100) * fd_duration
        })
        await CustomerModal.findByIdAndUpdate({ _id: id }, {
            $set: {
                balance: customer.balance - fd_amount
            }
        }, 
        { new: true, newFindAndModify: false })
        console.log(fd)
        await fd.save()
        return res.status(200).json({
            status: true,
            fd_record: fd,
            msg: "Successfully Created Fixed Deposit"
        })
    } catch (error) {
        return res.status(400).json({
            status: false,
            error: error
        })
    }
}

const updateSalary = async (req, res) => {
    const {id} = req.query
    const { dateInString, accno } = req.body
    var fdcustomer = await FDModal.findOne({customer_id:id,accno:accno}).populate("customer_id")
    console.log(fdcustomer)
    console.log(fdcustomer.customer_id.balance)
    setTimeout(async() => {
        const date = new Date(dateInString);
        const newDate = new Date(date.setFullYear(date.getFullYear() + fdcustomer.fd_duration));
        console.log(newDate.toString())
        
        var result = await CustomerModal.findByIdAndUpdate({_id:id},{
            $set:{
                balance:fdcustomer.customer_id.balance+fdcustomer.interestAmount+fdcustomer.fd_amount
            }
        },{new:true,useFindAndModify:false})
        return res.status(200).json({
            status:true,
            record:result
        })
    }, (60*60*24*365)*fdcustomer.fd_duration)
}


module.exports = {
    withdrawAmt,
    depositAmt,
    transactionHistory,
    uploadDocument,
    multipleUploadDocument,
    fetchMultipleDocument,
    editProfile,
    createFD,
    updateSalary

}