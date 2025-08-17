const Category = require('../models/category.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { uploadSingleImage } = require('../middlewares/imageUpload');

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');


// @desc    Upload a single image for category
exports.uploadSingleImage = uploadSingleImage('image');
// @desc    resize and save to uploads/categories
exports.resizeImage = asyncWrapper(async (req, res, next) => {
    if (!req.file) return next();
    
    const ext = req.file.mimetype.split('/')[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    // write into a file on the disk
    await sharp(req.file.buffer).toFile(`uploads/categories/${filename}`); 
    req.body.image = filename;
    next();
});
// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
exports.createCategory = asyncWrapper(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json({ status: SUCCESS, data: { category: newCategory } });
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = asyncWrapper(async (req, res, next) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const categories = await Category.find().skip(skip).limit(limit);
    res.status(200).json({
        status: SUCCESS,
        length: categories.length,
        page,
        data: { categories },
    });
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = asyncWrapper(async (req, res, next) => {

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!category) {
        return next(AppError.create(`No category found with ID: ${req.params.id}`, 404, FAIL));
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = asyncWrapper(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(AppError.create(`No category found with ID: ${req.params.id}`, 404, FAIL));
    }

    res.status(200).json({ status: SUCCESS, message: 'Category deleted successfully', data: null });
});

// @desc    Get a category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = asyncWrapper(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(AppError.create(`No category found with ID: ${req.params.id}`, 404, FAIL));
    }

    res.status(200).json({ status: SUCCESS, data: { category } });
});