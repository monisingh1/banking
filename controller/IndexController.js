const CustomerModal = require('../modal/CustomerModal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const transporter = require('../modal/emailConfig')
 
const register = async (req, res) => {
    console.log("Request Body:", req.body)
    //destructuring
    const { name, accno, email, balance, password, mobile, city, state, pincode, gender, pancard } = req.body

    try {
        //logic for checking already exists email
        const cust = await CustomerModal.findOne({ email: req.body.email });
        console.log("Customer Single Record:", cust)
        if (cust) {
            return res.status(400).json({
                success: false,
                msg: "Email already exists"
            });
        }

        const hashpassword = await bcrypt.hash(password, 10)
        console.log(hashpassword)

        //Customer Modal
        var customer = new CustomerModal({
            name,
            accno,
            email,
            balance,
            password: hashpassword,
            mobile,
            address: {
                city,
                state,
                pincode
            },
            gender,
            pancard
        })
        console.log(customer)
        var response = await customer.save()
        return res.status(200).json({
            "record": response,
            "msg": "Register Customer Successfully"
        })
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            "error": error,
            "msg": "Customer Not Register"
        })
    }
}

const login = async (req, res) => {

    //get userdetails 
    const { email, password } = req.body
    console.log(email,password)

    //logic for checking already exists email
    const customer = await CustomerModal.findOne({ email });
    console.log("Customer Single Record:", customer)
    
    if (customer!=null) {
        const isMatch = await bcrypt.compare(password, customer.password)
        console.log(isMatch)
        if (customer.email === email && isMatch) {
            const token = jwt.sign({ customer_id: customer._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

            return res.status(200).json({
                success: true,
                msg: "Login Success",
                record: customer,
                token:token
            })
        }
        else {
            return res.status(400).json({
                success: false,
                msg: "Email or Password is not valid"
            })
        }
    }
    else{
        return res.status(400).json({
            success: false,
            msg: "Email not registered!!"
        })
    }
}

const sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
        const customer = await CustomerModal.findOne({ email})
        if (customer) {
            const secret = customer._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({ customer_id: customer._id }, secret, { expiresIn: '5d' })
            const link = `http://localhost:3000/forgotpassword/${customer._id}/${token}`

            /*
http://localhost:3000/api/customer/reset/65c320d1a1dbbfb7ed48b28f/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NWMzMjBkMWExZGJiZmI3ZWQ0OGIyOGYiLCJpYXQiOjE3MDczNzExODIsImV4cCI6MTcwNzM3Mjk4Mn0.aNVtv_eBsCuQrim24xfNhcDYdqla7vsXiIxpAQ0cViQ
*/
            console.log("Link:====>",link)

            var mailOptions = {
                from: process.env.EMAIL_USER, // sender address
                to: customer.email, // list of receivers
                subject: "Reset Password", // Subject line
                text: "Link for Password Reset", // plain text body
                html: "<h3>Hii " + customer.name + ",Please copy this link <a href="+link+"> and reset your password</a></h3>"
            } 
            let info = await transporter.sendMail(mailOptions)
            return res.status(200).json({
                success: true,
                msg: "Password Reset Email Send...Please Check Your Email",
                "Info":info,
                id:customer._id,
                token:token
            })
        } else {
            return res.status(400).json({
                success: false,
                msg: "Email does not exists.",
            })
        }
    } else {
        return res.status(400).json({
            success: false,
            msg: "Email Fields are required",
        })
    }
}

const userPasswordReset = async (req, res) => {
    const { password, confirm_password } = req.body
    const { id, token } = req.query
    console.log("get:===>", id, token)
    console.log(password,confirm_password)
    try {
        const customer = await CustomerModal.findById(id)
        console.log(customer)
        const new_secret = customer._id + process.env.JWT_SECRET_KEY
        const {customer_id} = jwt.verify(token, new_secret)
        console.log(customer_id)
        if (password && confirm_password) {
            if (password !== confirm_password) {
                return res.status(400).json({
                    success: false,
                    msg: "New Password and Confirm Password doesn't match",
                })
            } 
            else {
                const newHashPassword = await bcrypt.hash(password, 10)
                console.log(customer._id)
                const data = await CustomerModal.findByIdAndUpdate({_id:customer._id}, { $set: { password: newHashPassword } },{
                    new: true,
                    useFindAndModify: false
                })
                return res.status(200).json({
                    success: true,
                    msg: "Password reset successfully",
                    record:data
                })
            }
        } 
        else {
            return res.status(400).json({
                success: false,
                msg: "All Fields required",
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Invalid Token.",
        })
    }
}


module.exports = {
    register,
    login,
    sendUserPasswordResetEmail,
    userPasswordReset
}
