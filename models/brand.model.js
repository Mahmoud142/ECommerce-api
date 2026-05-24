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

brandSchema.set('toJSON', {
    transform: function (doc, ret) {
        if (ret.image) {
            const filename = ret.image.split('/').pop();
            if (process.env.CLOUDINARY_CLOUD_NAME) {
                ret.image = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/brands/${filename}`;
            } else {
                ret.image = `${process.env.BASE_URL}/uploads/brands/${filename}`;
            }
        }
        return ret;
    }
});

const Brand = mongoose.model('Brand', brandSchema);
module.exports = Brand;