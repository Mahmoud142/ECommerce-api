
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

    return totalPrice;
}
// @desc      Add product to cart
// @route     POST /api/cart
// @access    Private/User
exports.addProductToCart = asyncWrapper(async (req, res, next) => {
    const { productId, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return next(AppError.create('Product not found', 404, FAIL));
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        // create a new cart if it doesn't exist
        cart = await Cart.create({
            user: req.user._id, products: [
            { product: productId, color, quantity: 1, price: product.price }
        ] });
    } else {
        const productIndex = cart.products.findIndex(
            (item) => item.product.toString() === productId && item.color === color);
        if (productIndex > -1) {
            // product already exists in cart, update quantity
            const cartItem = cart.products[productIndex];
            cartItem.quantity += 1;
            cart.products[productIndex] = cartItem;
        } else {
            cart.products.push({product: productId, color, price: product.price})
        }
    }

    calculateTotalCartPrice(cart);
    await cart.save();

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
    const cart = await Cart.findOne({ user: req.user._id });
    
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
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { products: { product: req.params.productId } } },
        { new: true }
    );
    if (!cart) {
        return next(AppError.create('Cart not found', 404, FAIL));
    }

    await calculateTotalCartPrice(cart);
    await cart.save();

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
    const productId = req.params.productId;
    const cart = await Cart.findOne({ user: req.user._id });
        // console.log("I am here");
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
exports.applyCouponToCart = asyncWrapper(async (req, res, next) => {

    // 1- check if coupon exists and is valid
    // console.log("I am coupon");
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

