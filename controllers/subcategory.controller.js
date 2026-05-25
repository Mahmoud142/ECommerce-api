const SubCategory = require('../models/subcategory.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');

//@desc Create a new subcategory
//@route POST /api/subcategories
//@access Private
exports.createSubCategory = asyncWrapper(async (req, res, next) => {
    const createdSubCategory = await SubCategory.create(req.body);
    return res.status(201).json({
        status: SUCCESS,
        data: { createdSubCategory }
    })
});

// @desc Get all subcategories
// @route GET /api/subcategories
//@access Public
exports.getAllSubCategories = asyncWrapper(async (req, res, next) => {
    const page = (req.query.page && req.query.page !== 'undefined') ? parseInt(req.query.page, 10) : 1;
    const limit = (req.query.limit && req.query.limit !== 'undefined') ? parseInt(req.query.limit, 10) : 10;
    const skip = (page - 1) * limit;

    let filterObject = {};
    if (req.params.categoryId) {
        filterObject = { category: req.params.categoryId };
    } else if (req.query.category) {
        filterObject = { category: req.query.category };
    }

    const subCategories = await SubCategory.find(filterObject).skip(skip).limit(limit);
    return res.status(200).json({
        status: SUCCESS,
        page,
        length: subCategories.length,
        data: subCategories,
    });
})

// @desc Get a subcategory by ID
// @route GET /api/subcategories/:id
//@access Public
exports.getSubCategory = asyncWrapper(async (req, res, next) => {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
        return next(AppError.create('SubCategory not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        data: { subCategory }
    });
})
// @desc Update a subcategory by ID
// @route PUT /api/subcategories/:id
//@access Private
exports.updateSubCategory = asyncWrapper(async (req, res, next) => {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subCategory) {
        return next(AppError.create('SubCategory not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        data: { subCategory }
    });
})

// @desc Delete a subcategory by ID
// @route DELETE /api/subcategories/:id
//@access Private
exports.deleteSubCategory = asyncWrapper(async (req, res, next) => {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);
    if (!subCategory) {
        return next(AppError.create('SubCategory not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        message: 'SubCategory deleted successfully',
        data: null
    });
})