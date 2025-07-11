const Product = require('../models/product.model');

const createProduct = async (req, res) => {
    try {
        const {
            name, description, price, category, Image, brand, countInStock } = req.body;
            if (!name || !description || !price || !category || !Image || !countInStock) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
        const product = new Product({
            user: req.user._id,
            name,
            description,
            price,
            category,
            Image: Image || ' ',
            brand: brand || ' ',
            countInStock
        })
        const createdProduct = await product.save();
        res.status(201).json({ message: 'Product created successfully', product: createdProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error From product' });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({products : products });
    }catch(error) {
        res.status(500).json({ message: 'Server error while fetching products' });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product : product });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching product by ID' });
    }
}
module.exports = {
    createProduct,
    getAllProducts,
    getProductById
}