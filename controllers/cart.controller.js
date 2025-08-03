
const Cart = require('../models/cart.model');
const Coupon = require('../models/coupon.model');
const Product = require('../models/product.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');

const calculateTotalCartPrice = async (cart) => {
    let totalPrice = 0;
    cart.products.forEach((product) => {
        totalPrice += product.price * product.quantity;
    });
    cart.totalCartPrice = totalPrice;
    cart.totalAfterDiscount = totalPrice;
    cart.coupon = undefined;

    await cart.save();

    return totalPrice;
}
// @desc      Add product to cart
// @route     POST /api/cart
// @access    Private/User
exports.addProductToCart = asyncWrapper(async (req, res, next) => {

    const { productId, color } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === req.body.productId &&
                p.color === req.body.color
        );
        if (productIndex > -1) {
            // product already exists in cart, update quantity
            const productItem = cart.products[productIndex];
            productItem.quantity += 1;
            cart.products[productIndex] = productItem;
        } else {
            cart.products.push({ product: productId, color, price: product.price })
        }
    }
    else {
        cart = await Cart.create({
            products: [{ product: productId, color, price: product.price }],
            user: req.user._id
        });
    }

    await calculateTotalCartPrice(cart);

    res.status(200).json({
        success: true,
        message: 'Product added to cart successfully',
        numberOfItems: cart.products.length,
        data: cart
    })

})

// @desc Get Logged User Cart
// @route GET /api/cart
// @access Private/User
exports.getLoggedUserCart = asyncWrapper(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id })
        .populate({
            path: 'products.product',
            select: 'title imageCover ratingsAverage brand category ',
            populate: { path: 'brand', select: 'name -_id', model: 'Brand' },
        })
        .populate({
            path: 'products.product',
            select: 'title imageCover ratingsAverage brand category',
            populate: { path: 'category', select: 'name -_id', model: 'Category' },
        });
    
    if (!cart) {
        return next(AppError.create('Cart not found', 404, FAIL));
    }

    return res.status(200).json({
        status: SUCCESS,
        numberOfItems: cart.products.length,
        data: { cart }
    });
});

// @desc delete product from cart
// @route DELETE /api/cart/:productId
// @access Private/User
exports.deleteProductFromCart = asyncWrapper(async (req, res, next) => {
    const cart = await Cart.findOne(
        { user: req.user._id },
        { $pull: { products: { product: req.params.productId } } },
        { new: true }
    );
    calculateTotalCartPrice(cart);
    await cart.save();
    if (!cart) {
        return next(AppError.create('Cart not found', 404, FAIL));
    }
    return res.status(200).json({
        status: SUCCESS,
        numberOfItems: cart.products.length,
        message: 'Product removed from cart successfully',
        data: { cart }
    });
})


// @desc clear product from cart
// @route DELETE /api/cart/
// @access Private/User
exports.clearLoggedUserCart = asyncWrapper(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    return res.status(200).json({
        status: SUCCESS,
        message: 'Cart cleared successfully',
        data: null
    });
})

// @desc     update product quantity in cart
// @route    PUT /api/cart/:productId
// @access   Private/User
exports.updateCartProductQuantity = asyncWrapper(async (req, res, next) => {

    const quantity = req.body.quantity;
    const cart = await Cart.findOne({ user: req.user._id })
        .populate({
            path: 'products.product',
            select: 'title imageCover ratingsAverage brand category',
            populate: { path: 'brand', select: 'name - _id', model: 'Brand' }
        })
        .populate({
            path: 'products.product',
            select: 'title imageCover ratingsAverage brand category',
            populate: { path: 'category', select: 'name -_id', model: 'Category' }
        });

    if (!cart) {
        return (AppError('Cart not found', 404, FAIL));
    }

    const itemIndex = cart.products.findIndex((item) => item.product._id.toString() === productId);

    if (itemIndex > -1) {
        const productItem = cart.products[itemIndex];
        productItem.quantity = quantity;
        cart.products[itemIndex] = productItem;
    } else {
        return next(AppError.create(`No Product Cart item found for ${productId}`, 404, FAIL));
    }
    calculateTotalCartPrice(cart);
    await cart.save();

    return res.status(200).json({
        status: SUCCESS,
        numberOfItems: cart.products.length,
        message: 'Cart updated successfully',
        data: { cart }
    })
})

// @desc Apply coupon to cart
// @route POST /api/cart/applyCoupon
// @access Private/User
exports.applyCoupon = asyncWrapper(async (req, res, next) => {

    // 1- check if coupon exists and is valid
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        expire: { $gt: Date.now() }
    });
    if (!coupon) {
        return next(AppError.create('Invalid or expired coupon', 400, FAIL));
    }
    // 2- check if user has a cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(AppError.create('Cart not found', 404, FAIL));
    }
    const totalPrice = cart.totalCartPrice;
    // 3- calculate total after discount
    const totalAfterDiscount = totalPrice - ((totalPrice * coupon.discount )/ 100).toFixed(2);
    cart.totalAfterDiscount = totalAfterDiscount;
    await cart.save();

    return res.status(200).json({
        status: SUCCESS,
        numberOfItems: cart.products.length,
        message: 'Coupon applied successfully',
        data: { cart }
    });
});

