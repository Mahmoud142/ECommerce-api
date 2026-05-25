const mongoose = require('mongoose');


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'Product title is required'],
            minlength: [3, 'Product title must be at least 3 characters long'],
            // Remove unique: true to avoid duplicate key errors if index still exists
        },
        slug: {
            type: String,
            required: [true, 'Product slug is required'],
            lowercase: true
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        quantity: {
            type: Number,
            required: [true, 'Product quantity is required'],
            min: [0, 'Quantity cannot be negative']
        },
        sold: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Product price cannot be negative'],
            maxlength: [30, 'Product price must not exceed 30 characters']
        },
        priceAfterDiscount: {
            type: Number
        },
        availableColors: {
            type: [String]
        },
        imageCover: {
            type: String,
            required: [true, 'Product cover image is required']
        },
        images: {
            type: [String]
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Product category is required']
        },
        subCategory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory',
            required: [true, 'Product subcategory is required']
        }],
        brand: {
            type: String,
            default: 'Unknown'
        },
        ratingsAverage: {
            type: Number,
            min: [1, 'Rating must be above or equal to 1'],
            max: [5, 'Rating must be below or equal to 5'],
            set : val => Math.round(val * 10) / 10 // Round to one decimal place
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
    }, {
    timestamps: true
    }
)

productSchema.set('toJSON', {
    transform: function (doc, ret) {
        if (ret.imageCover) {
            const filename = ret.imageCover.split('/').pop();
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                ret.imageCover = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/products/${filename}`;
            } else {
                ret.imageCover = `${process.env.BASE_URL}/uploads/products/${filename}`;
            }
        }
        if (ret.images && ret.images.length > 0) {
            ret.images = ret.images.map(image => {
                const filename = image.split('/').pop();
                if (process.env.CLOUDINARY_CLOUD_NAME) {
                    return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/products/${filename}`;
                } else {
                    return `${process.env.BASE_URL}/uploads/products/${filename}`;
                }
            });
        }
        ret.title = ret.name;
        return ret;
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;