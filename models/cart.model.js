const mongoose = require('mongoose');



const cartSchema = new mongoose.Schema({
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', },
            quantity: { type: Number, default: 1, },
            color: String,
            price: Number
        }
    ],
    totalCartPrice: Number,
    totalAfterDiscount: Number,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    coupon: String,
}, { timestamps: true });


module.exports = mongoose.model('Cart', cartSchema);
