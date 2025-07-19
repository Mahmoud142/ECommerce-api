const Product = require('../models/product.model');

const createProduct = async (req, res) => {
    try {
        const {
            name, description, price, category, image, brand, countInStock } = req.body;
            if (!name || !description || !price || !category || !image || !countInStock) {
                return res.status(400).json({
                    status: false,
                    message: 'Missing required fields'
                });
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
        })

        const createdProduct = await product.save();
        res.status(201).json({
            status: true,
            message: 'Product created successfully',
            data: { product: createdProduct }
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
}

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({ status: true, message: 'Products fetched successfully', data: { products: products } });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message  });
    }
}

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }
        res.status(200).json({ status: true, message: 'Product fetched successfully', data: { product: product } });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }
        const {name , description, price, category, image, brand, countInStock } = req.body;
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.image = image || product.image;
        product.brand = brand || product.brand;
        product.countInStock = countInStock || product.countInStock;
        const updatedProduct = await product.save();
        res.status(200).json({ status: true, message: 'Product updated successfully', data: { product: updatedProduct } });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ status: false, message: error.message  });
    }
}

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product) {
            return res.status(404).json({ status: false, message: 'Product not found' });
        }
        res.status(200).json({ status: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
}

const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            const alreadyReviewed = product.reviews.find(
                (review) => review.user.toString() === req.user._id.toString());
            if (alreadyReviewed) {
                return res.status(400).json({ status: false, message: 'Product already reviewed' });
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
                status: true,
                message: 'Review added successfully',
                data: { review: review }
            });
        } else {
            res.status(404).json({ status: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error("error from reviews", error.message);
        res.status(500).json({ status: false, message: error.message });
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview
}