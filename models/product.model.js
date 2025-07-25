const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    }
})

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: [true, 'Product title is required'],
            unique: [true, 'Product title must be unique'],
            minlength: [3, 'Product title must be at least 3 characters long'],
            maxlength: [100, 'Product title must not exceed 100 characters long']
        },
        slug: {
            type: String,
            required: [true, 'Product slug is required'],
            lowercase: true
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [1000, 'Product description must not exceed 1000 characters']
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
        reviews:[reviewSchema],
    }, {
    timestamps: true
    }
)
const setImageUrl = (doc) => {
    if(doc.imageCover && !doc.imageCover.startsWith(`${process.env.BASE_URL}/uploads/products/`)) {
        doc.imageCover = `${process.env.BASE_URL}/uploads/products/${doc.imageCover}`;
    }
    if(doc.images && doc.images.length > 0) {
        doc.images = doc.images.map(image => {
            if(!image.startsWith(`${process.env.BASE_URL}/uploads/products/`)) {
                return `${process.env.BASE_URL}/uploads/products/${image}`;
            }
            return image;
        });
    }
}

productSchema.post('save', (doc) => {
    setImageUrl(doc);
})

productSchema.post('init', (doc) => {
    setImageUrl(doc);
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;