const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var fdSchema = mongoose.Schema({
    customer_id:{ 
        type: Schema.Types.ObjectId, 
        ref: "Customer" 
    },
    accno:{
        type: Number,
        default:0
    },
    fd_amount: {
        type: Number,
        required: [true, "Fixed Deposit Amount is required"],
        minlength:4,
        maxlength:10
    },
    balance_after_creating_fd:{
        type: Number,
        required: [true, "Balance After Creating FD is required"],
        trim:true
    },
    transaction_type:{
        type: String,
        default:"Fixed Deposit"
    },
    interestRate:{
        type: Number,
        default:7.1
    },
    fd_duration:{
        type: Number,
        required: [true, "Duration is required"],
    },
    timestamp: {
       type: String,
       default:Date()
    },
    interestAmount:{
        type: Number,
        default:0
    }
})


//compile schema to model
const fdmodel = mongoose.model('FixedDeposit', fdSchema)

module.exports = fdmodel
