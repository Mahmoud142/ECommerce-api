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

//@desc Get all orders
//@route GET /api/orders
//@access Protected/user-admin
exports.getAllOrders = asyncWrapper(async (req, res, next) => {
    const orders = await Order.find();
    res.status(200).json({
        status: SUCCESS,
        message: 'Orders retrieved successfully',
        data: orders
    })
});

///@desc Get single order
//@route GET /api/orders/:id
//@access Protected/user-admin
exports.getSingleOrder = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(AppError.create('Order not found', 404, FAIL));
    }

    res.status(200).json({
        status: SUCCESS,
        message: 'Order retrieved successfully',
        data: order
    })
});

//@desc Update order to paid
//@route PUT /api/orders/:id/pay
//@access Protected/user-admin
exports.updateOrderToPaid = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(AppError.create('Order not found', 404, FAIL));
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();

    res.status(200).json({
        status: SUCCESS,
        message: 'Order updated to paid successfully',
        data: updatedOrder
    })
})

exports.updateOrderToDelivered = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(AppError.create('Order not found', 404, FAIL));
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    
    res.status(200).json({
        status: SUCCESS,
        message: 'Order updated to delivered successfully',
        data: updatedOrder
    })
})
