const mongoose = require('mongoose');


const couponSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: [true, 'Coupon name is required'],
        unique: true,
    },
    expire: {
        type: Date,
        required: [true, 'Coupon expiration date is required'],
    },
    discount: {
        type: Number,
        required: [true, 'Coupon discount is required'],
        min: [0, 'Discount cannot be negative'],
    }
},{timestamps: true});

const Coupon = mongoose.model('Coupon', couponSchema);
module.exports = Coupon;