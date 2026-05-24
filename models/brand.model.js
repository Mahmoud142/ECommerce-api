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
    if (doc.image) {
        const filename = doc.image.split('/').pop();
        if (process.env.CLOUDINARY_CLOUD_NAME) {
            doc.image = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/brands/${filename}`;
        } else {
            doc.image = `${process.env.BASE_URL}/uploads/brands/${filename}`;
        }
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