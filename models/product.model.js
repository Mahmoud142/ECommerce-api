const mongoose = require('mongoose');
const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: [true, 'Product name is required']
        },
        description: {
            type: String,
            required: [true, 'Product description is required']
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative']
        },
        category: {
            type: String,
            required: [true, 'Product category is required']
        },
        Image: {
            type: String,
            required: [true, 'Product image is required']
        },
        brand: {
            type: String,
            default: 'Unknown'
        },
        countInStock: {
            type: Number,
            required: [true, 'Product stock count is required'],
            min: [0, 'Stock count cannot be negative']
        },
        rating: {
            type: Number,
            default: 0
        },
        numReviews: {
            type: Number,
            default: 0
        }  
    }, {
    timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);
module.exports = Product;