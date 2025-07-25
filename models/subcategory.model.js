const mongoose = require('mongoose');


const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subcategory name is required'],
        unique: [true, 'Subcategory name must be unique'],
        minlength: [3, 'Subcategory name must be at least 3 characters long'],
        maxlength: [50, 'Subcategory name must not exceed 50 characters'],
        trim: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
    description: {
        type: String,
        default: ''
    },
    category: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    }
}, { timestamps: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
module.exports = SubCategory;