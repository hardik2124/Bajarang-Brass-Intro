const mongoose = require('mongoose');
require('dotenv').config();


exports.DBConnection = async () => {
    mongoose.connect(process.env.DATABASE_URL)
        .then(() => console.log("Database connected successfully"))
        .catch((error) => {
            console.error("Database connection failed:", error);
            process.exit(1);
        });
};