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



const setImageUrl = (doc) => {
    if (doc.image && !doc.image.startsWith(`${process.env.BASE_URL}/uploads/brands/`)) {
        doc.image = `${process.env.BASE_URL}/uploads/brands/${doc.image}`;
    }
}


brandSchema.post('init', (doc) => {
    setImageUrl(doc);
})

brandSchema.post('save', (doc) => {
    setImageUrl(doc);
})

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;