const mongoose = require('mongoose');


const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subcategory name is required'],
        trim: true,
    },
    slug: {
        type: String,
        unique: [true, 'Slug must be unique'],
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