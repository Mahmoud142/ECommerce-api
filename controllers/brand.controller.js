const Brand = require('../models/brand.model.js')
const asyncWrapper = require('../middlewares/asyncWrapper.js');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const { uploadSingleImage } = require('../middlewares/imageUpload')
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

// uploading Image
exports.uploadBrandImage = uploadSingleImage('image');


exports.resizeImage = asyncWrapper(async (req, res, next) => {
    if (!req.file)
        return next();
    const ext = req.file.mimetype.split('/')[1];
    const imageName = `brand-${uuidv4()}-${Date.now()}.${ext}`;
    
    const processedBuffer = await sharp(req.file.buffer)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toBuffer();

    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        const { uploadStream } = require('../utils/cloudinary');
        const publicId = imageName.split('.')[0];
        await uploadStream(processedBuffer, {
            folder: 'brands',
            public_id: publicId
        });
    } else {
        await sharp(processedBuffer).toFile(`uploads/brands/${imageName}`);
    }
    
    // Always store only the clean filename/id in the database to remain storage-independent
    req.body.image = imageName;
    next();
})
//@desc Create a new brand
//@route POST /api/brands
//@access Private/Admin
exports.createBrand = asyncWrapper(async (req, res,next) => {
    const brand = await Brand.create(req.body);
    res.status(201).json({
        status: SUCCESS,
        message: 'Brand created successfully',
        data: brand
    });
})

//@desc Get all brands
//@route GET /api/brands
//@access Public
exports.getAllBrands = asyncWrapper(async (req, res,next) => {
    const brands = await Brand.find({});
    res.status(200).json({
        status: SUCCESS,
        message: 'Brands retrieved successfully',
        data: {brands}
    });
})

//@desc Get a specific brand by ID
//@route GET /api/brands/:id
//@access Public
exports.getBrandById = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findById(id);
    if (!brand) {
        return res.status(404).json({
            status: FAIL,
            message: 'Brand not found'
        });
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'Brand fetched successfully',
        data: brand
    });
});

//@desc Update a brand
//@route PUT /api/brands/:id
//@access Private/Admin
exports.updateBrand = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });
    if (!brand) {
        return res.status(404).json({
            status: FAIL,
            message: 'Brand not found'
        });
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'Brand updated successfully',
        data: brand
    });
});

//@desc Delete a brand
//@route DELETE /api/brands/:id
//@access Private/Admin
exports.deleteBrand = asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) {
        return res.status(404).json({
            status: FAIL,
            message: 'Brand not found'
        });
    }
    res.status(200).json({
        status: SUCCESS,
        message: 'Brand deleted successfully'
    });
});