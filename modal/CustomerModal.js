const mongoose = require('mongoose');

var customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        lowercase: true
    },
    accno:{
        type: String,
        required: [true, "Accno is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    balance:{
        type: Number,
        required: [true, "Balance is required"],
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        trim: true,
        maxlength: 100,
        minlength: 5
    },
    mobile: {
        type: Number,
        required: [true, "Mobile Number is required"],
        trim: true,
        maxlength: 10,
        minlength: 10
    },
    address: {
        type: Object,
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
        },
        pincode: {
            type: Number,
            required: [true, "Pincode is required"],
            trim: true,
            maxlength: 6,
            minlength: 6
        }
    },
    gender: {
        type: String,
        required: [true, "Gender is required"],
        trim: true
    },
    pancard:{
        type: String,
        required: [true, "PANCARD is required"],
        trim: true,
        maxlength: 10,
        minlength: 10
    },
    acctype:{
        type: String,
        default:"Saving"
    },
    simpleinterestrate:{
        type:Number,
        default:3.1
    },
    fdinterestrate:{
        type:Number,
        default:7.1
    },
    role:{
        type: String,
        default:"customer"
    },
    status:{
        type: Number,
        default: 0
    },
    info: {
       type: String,
       default:Date()
    },
    ifsc_code:{
        type: String,
        default:"MPB89890"
    }
})
//compile schema
var customermodal = mongoose.model('Customer',customerSchema)

module.exports = customermodal