const Category = require('../models/category.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { uploadSingleImage } = require('../middlewares/imageUpload');

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
exports.uploadSingleImage = uploadSingleImage('image');
exports.resizeImage = asyncWrapper(async (req, res, next) => {
    if (!req.file) return next();
    
    const ext = req.file.mimetype.split('/')[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    // write into a file on the disk
    await sharp(req.file.buffer).toFile(`uploads/categories/${filename}`); 
    req.body.image = filename;
    next();
});
exports.createCategory = asyncWrapper(async (req, res, next) => {
    const newCategory = await Category.create(req.body);
    res.status(201).json({ status: SUCCESS, data: { category: newCategory } });
}); 

