const Product = require('../models/product.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');

const createProduct = asyncWrapper(async (req, res, next) => {
    const {
        name, description, price, category, image, brand, countInStock } = req.body;
    if (!name || !description || !price || !category || !image || !countInStock) {
        const err = AppError.create('All fields are required', 400, FAIL);
        return next(err);
    }
    const product = new Product({
        user: req.user._id,
        name,
        description,
        price,
        category,
        image: image || 'http://localhost:3000/api/uploads/default.jpg',
        brand: brand || ' ',
        countInStock
    });
    const createdProduct = await product.save();
    res.status(201).json({
        status: SUCCESS,
        message: 'Product created successfully',
        data: { product: createdProduct }
    });
});

const getAllProducts = asyncWrapper(async (req, res, next) => {
    const products = await Product.find({});
    res.status(200).json({ status: SUCCESS, message: 'Products fetched successfully', data: { products: products } });
});

const getProductById = asyncWrapper(async (req, res, next) => {
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

const updateProduct = asyncWrapper(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        const err = AppError.create('Product not found', 404, FAIL);
        return next(err);
    }

    const { name, description, price, category, image, brand, countInStock } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.countInStock = countInStock || product.countInStock;

    const updatedProduct = await product.save();
    res.status(200).json({ status: SUCCESS, message: 'Product updated successfully', data: { product: updatedProduct } });
});

const deleteProduct = asyncWrapper(async (req, res, next) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        const err = AppError.create('Product not found', 404, FAIL);
        return next(err);
    }
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: SUCCESS, message: 'Product deleted successfully' });
});

const createProductReview = asyncWrapper(async (req, res, next) => {

    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
        const err = AppError.create('Product not found', 404, FAIL);
        return next(err);
    }

    const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
        return res.status(400).json({ status: FAIL, message: 'Product already reviewed' });
    }
    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();

    res.status(201).json({
        status: SUCCESS,
        message: 'Review added successfully',
        data: { review: review }
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview
}