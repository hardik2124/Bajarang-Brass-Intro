const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        ownerID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        images: [
            {
                type: String,
                required: true,
            }
        ],
        category: {
            type: String,
            required: true,
            trim: true,
        },
        component: [
            {
                type:mongoose.Schema.Types.ObjectId,
                ref: 'Component',
            }
        ],
        Threads: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Thread',
            }
        ],
        sizeTable: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SizeTable',
        }]
        


    },
    {
        timestamps: true,
    }
)



module.exports = mongoose.model('Product', productSchema);