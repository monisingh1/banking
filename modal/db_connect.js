const mongoose = require('mongoose');
const connectDB = async(DB_URL,DB_NAME)=>{
    try {
        const DB_OPTIONS = {
            dbName:DB_NAME
        }
        await mongoose.connect(DB_URL,DB_OPTIONS);
        console.log("Database Connected Successfully!!")
    } catch (error) {
        console.log("Database Connection Error:",error)
    }
}

module.exports = connectDB