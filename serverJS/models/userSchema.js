const e = require('express');
const mongoose = require('mongoose');
const { type } = require('os');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        companyDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company'
        },
        passwordResetToken: {
            type: String,
            default: null,
        },




    },
    {
        timestamps: true,
    }

);

module.exports = mongoose.model('User', userSchema);