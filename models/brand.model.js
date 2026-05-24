const mongoose = require('mongoose');


const brandSchema = new mongoose.Schema({
    name: {
        type: String,
        uinique: true,
        minlength: [3, 'Too short brand name'],
        maxlength: [50, 'Too long brand name'],
    },
    slug: {
        type: String,
        lowercase: true
    },
    image: { type: String }
}, { timestamps: true });
// brand image hooks removed

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;