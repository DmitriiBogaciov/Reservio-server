const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.COSMOS_DB_CONNECTION_STRING, {
            retryWrites: false
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB;