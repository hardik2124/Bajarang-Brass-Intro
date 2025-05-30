const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        companyAddress: {
            buildingName: String,
            streetName: String,
            streetNumber: String,
            landmark: String,
            area: String,
            zipCode: String,
            city: String,
            state: String,
            country: String,
        },
        companyPhoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        companyEmail: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        companyWebsite: {
            type: String,
            required: false,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);


module.exports = mongoose.model('Company', companySchema);