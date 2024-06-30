var jwt = require('jsonwebtoken')
var CustomerModal = require('../modal/CustomerModal')

const checkCustomerAuth = async(req,res,next)=>{
    let token 
    const {authorization} = req.headers
    console.log("Authorization=====>",authorization)
    try {
        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1]
            console.log("Token=====>",token)
            console.log("=======================")
            //Verify token
            const {customer_id} = jwt.verify(token,process.env.JWT_SECRET_KEY)
            console.log("customer_id:",customer_id)
            console.log("=======================")

            //Get Customer From Token ,except password all data is get in req.customer
           req.customer = await CustomerModal.findById(customer_id).select('-password')
           console.log("Customer Details:",req.customer)
           next()    
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            msg: "Token Expires",
            Error: error
        })
    }
    if (!token) {
        return res.status(401).json({
            success: false,
            msg: "Unauthorized Customer, No Token"
        })
    }
    
}

module.exports = checkCustomerAuth