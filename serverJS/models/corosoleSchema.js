const mongoose = require('mongoose');   

const corosoleImageSchema = new mongoose.Schema(
    {
        owberID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        imageUrl: {
            type: String,
            required: true,
            trim: true
        },
        imageName: {
            type: String,
            required: true,
            trim: true
        },
        imageProductCategory: {
            type: String,
            required: false,
            trim: true
        },
        imageProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    }
)

module.exports = mongoose.model('CorosoleImage', corosoleImageSchema);