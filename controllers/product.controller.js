const Product = require('../models/product.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const multer = require('multer');
const { json } = require('body-parser');

// Multer configuration for file uploads
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400, FAIL), false);
    }
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });


exports.uploadProductImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 }
]);


exports.resizeProductImages = asyncWrapper(async (req, res, next) => {

    // 1) Image Process for imageCover
    if (req.files.imageCover) {
        const ext = req.files.imageCover[0].mimetype.split('/')[1];
        const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.${ext}`;
        await sharp(req.files.imageCover[0].buffer)
            .toFile(`uploads/products/${imageCoverFilename}`); // write into a file on the disk
        req.body.imageCover = imageCoverFilename;
    }
    // product images array
    req.body.images = [];
    // 2- Image processing for images
    if (req.files.images) {
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const ext = img.mimetype.split('/')[1];
                const filename = `products-${uuidv4()}-${Date.now()}-${index + 1}.${ext}`;
                await sharp(img.buffer)
                    .toFile(`uploads/products/${filename}`);
                req.body.images.push(filename);
            })
        );
    }
    next();
});


//@desc Create a new product
//@route POST /api/products
//@access Private/Admin
exports.createProduct = asyncWrapper(async (req, res, next) => {
    const product = new Product(req.body);
    // console.log('req.body', req.body);
    const createdProduct = await product.save();
    res.status(201).json({
        status: SUCCESS,
        message: 'Product created successfully',
        data: { product: createdProduct }
    });
});

//@desc Get all products
//@route GET /api/products
//@access Public
exports.getAllProducts = asyncWrapper(async (req, res, next) => {


    // filtering
    const queryStringObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryStringObj[field]);
    // console.log('queryStringObj', queryStringObj);
    let queryStr = JSON.stringify(queryStringObj);
    
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|eq)\b/g, (match) => `$${match}`);

    // Manual conversion of query params to filter object
    const filterObj = {};
    Object.keys(queryStringObj).forEach(key => {
        // Check for operators in the value, e.g. price[lte]=45
        if (typeof queryStringObj[key] === 'object') {
            filterObj[key] = {};
            Object.keys(queryStringObj[key]).forEach(op => {
                filterObj[key][`$${op}`] = queryStringObj[key][op];
            });
        } else if (key.includes('[') && key.includes(']')) {
            // For query like price[lte]=45
            const field = key.split('[')[0];
            const op = key.split('[')[1].replace(']', '');
            if (!filterObj[field]) filterObj[field] = {};
            filterObj[field][`$${op}`] = queryStringObj[key];
        } else {
            filterObj[key] = queryStringObj[key];
        }
    });

    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    /*
    { price: { $lt: 60 } }
    */
    const products = await Product.find(filterObj)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name -_id' });

    res.status(200).json({
        status: SUCCESS,
        message: 'Products fetched successfully',
        page: page,
        length: products.length,
        data: { products }
    });
});

//@desc Get a single product by ID
//@route GET /api/products/:id
//@access Public
exports.getProductById = asyncWrapper(async (req, res, next) => {
    if (!req.params.id) {
        const err = AppError.create('Product ID is required', 400, FAIL);
        return next(err);
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
        const err = AppError.create('Product not found', 404, FAIL);
        return next(err);
    }
    res.status(200).json({ status: SUCCESS, message: 'Product fetched successfully', data: { product: product } });
});

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/Admin
exports.updateProduct = asyncWrapper(async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!updatedProduct) {
        const err = AppError.create('Product not found', 404, FAIL);
        return next(err);
    }
    res.status(200).json({ status: SUCCESS, message: 'Product updated successfully', data: { product: updatedProduct } });
});

//@desc Delete a product
//@route DELETE /api/products/:id
//@access Private/Admin
exports.deleteProduct = asyncWrapper(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        const err = AppError.create('Product not found', 404, FAIL);
        return next(err);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: SUCCESS, message: 'Product deleted successfully' });
});
