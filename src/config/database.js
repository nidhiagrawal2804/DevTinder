const mongooose = require("mongoose");

require("dotenv").config();

const connectDB = async () => {
    await mongooose.connect(process.env.DB_CONNECTION)
    
}

module.exports = connectDB;