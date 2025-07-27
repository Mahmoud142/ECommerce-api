const Brand = require('../models/brand.model.js')
const asyncWrapper = require('../middlewares/asyncWrapper.js');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const { uploadSingleImage } = require('../middlewares/imageUpload')
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
exports.uploadBrandImage = uploadSingleImage('image');
exports.resizeImage = asyncWrapper(async (req, res, next) => {
    if (!req.file)
        return next();
    const ext = req.file.mimetype.split('/')[1];
    const imageName = `brand-${uuidv4()}-${Date.now()}.${ext}`;
    await sharp(req.file.buffer).toFile(`uploads/brands/${imageName}`);
    req.body.image = imageName;
    next();
})
exports.createBrand = asyncWrapper(async (req, res,next) => {
    const brand = await Brand.create(req.body);
    res.status(201).json({
        status: SUCCESS,
        message: 'Brand created successfully',
        data: brand
    });
})

exports.getAllBrands = asyncWrapper(async (req, res,next) => {
    const brands = await Brand.find({});
    res.status(200).json({
        status: SUCCESS,
        message: 'Brands retrieved successfully',
        data: {brands}
    });
})

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