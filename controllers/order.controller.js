const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');

const AppError = require('../utils/appError');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');

//@desc Create a cash order
//@route POST /api/orders/cash
//@access Protected/User
exports.createCashOrder = asyncWrapper(async (req, res, next) => {

    const taxPrice = 0;
    const ShippingPrice = 0;

    // get cart
    const cart = await Cart.findOne({ _id: req.params.cartId });
    if (!cart) {
        return next(AppError.create('Cart not found', 404, FAIL));
    }
    const cartPrice = cart.totalAfterDiscount ? cart.totalAfterDiscount : cart.totalPrice;

    // create order with cash
    console.log("I am inside createCashOrder controller");
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: req.body.totalOrderPrice
    })
    // update product quantity
    if (order) {
        const bulkOption = Array.isArray(cart.cartItems) ? cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: { $inc: { quantity: -item.quantity, sold: +item.quantity } }
            },
        })) : [];
        await Product.bulkWrite(bulkOption, {});

        await Cart.findByIdAndDelete(cart._id);
    }

    res.status(201).json({
        status: SUCCESS,
        message: 'Order created successfully',
        data: order
    })
})