const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var transactionSchema = mongoose.Schema({
    customer_id:{ 
        type: Schema.Types.ObjectId, 
        ref: "Customer" 
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        trim: true,
    },
    balance_before_transaction:{
        type: Number,
        required: [true, "Balance is required"],
        trim: true,
    },
    balance_after_transaction:{
        type: Number,
        required: [true, "Balance is required"],
        trim: true,
    },
    transaction_type:{
        type: String,
        required: [true, "Transaction type is required"],
        trim: true,
    },
    timestamp: {
       type: String,
       default:Date()
    }
})

//compile schema to model
const transactionmodel = mongoose.model('Transaction', transactionSchema)

module.exports = transactionmodel