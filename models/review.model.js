const mongoose = require('mongoose');

const Product = require('./product.model');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review text is required'],
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product ID is required']
    },
}, { timestamps: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'name profileImg'
    });
    next();
});

reviewSchema.statics.calculateAverageRating = async function (productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: 'product',
                averageRating: { $avg: '$rating' },
                noOfReviews: { $sum: 1 }
            },
        },
    ])
    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId,
            {
                ratingsAverage: result[0].averageRating,
                ratingsQuantity: result[0].noOfReviews,
            });
    } else {
        await Product.findByIdAndUpdate(productId,
            {
                ratingsAverage: 0,
                ratingsQuantity: 0,
            }
        )
    }
}


reviewSchema.post('save', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('remove', async function () {
    await this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
