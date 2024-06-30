const express = require('express');
const app = express()
const indexRouter = require('./route/Index');
const adminRouter = require('./route/Admin')
const customerRouter = require('./route/Customer')
const dotenv = require('dotenv');
dotenv.config({path:'./config/config.env'})

const PORTNO = process.env.PORTNO || 4000
var connectDB = require('./modal/db_connect')

//Database Connection
connectDB(process.env.DB_URL,process.env.DB_NAME)

/*
Returns middleware that only parses json 
*/
app.use(express.json())

//Static Files
app.use('/uploaddocuments',express.static('uploaddocuments'))
app.use('/multipleuploaddocuments',express.static('multipleuploaddocuments'))

//set Route
app.use('',indexRouter)
app.use('/admin',adminRouter)
app.use('/customer',customerRouter)

app.listen(PORTNO,()=>{
    console.log(`Server Listening at:http://localhost:${PORTNO}`)
})