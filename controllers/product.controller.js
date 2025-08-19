const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const multer = require('multer');


const Product = require('../models/product.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');
const ApiFeatures = require('../utils/apiFeatures');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');

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

    const noOfProducts = await Product.countDocuments();

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .filter()
        .search('Product')
        .sort()
        .limitFields()
        .paginate(noOfProducts);

    const { mongooseQuery, paginationResult } = apiFeatures;
    const products = await mongooseQuery;

    res.status(200).json({
        status: SUCCESS,
        message: 'Products fetched successfully',
        pagination: paginationResult,
        results: products.length,
        data: { products },
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
