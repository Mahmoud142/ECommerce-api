const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required:[true, 'Category name is required'],
        unique: [true, 'Category name must be unique'],
        minlength: [3, 'Category name must be at least 3 characters long'],
        maxlength: [50, 'Category name must not exceed 50 characters']
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Category description must not exceed 500 characters']
    },
    image: String,

}, { timestamps: true });

categorySchema.set('toJSON', {
    transform: function (doc, ret) {
        if (ret.image) {
            const filename = ret.image.split('/').pop();
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                ret.image = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/categories/${filename}`;
            } else {
                ret.image = `${process.env.BASE_URL}/uploads/categories/${filename}`;
            }
        }
        return ret;
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;