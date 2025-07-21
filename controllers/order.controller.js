const Order = require('../models/order.model');
const Product = require('../models/product.model');
const { SUCCESS, FAIL } = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const asyncWrapper = require('../middlewares/asyncWrapper');


const createOrder = asyncWrapper(async (req, res, next) => {

    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice } = req.body;

    if (!shippingAddress || !paymentMethod || !orderItems || orderItems.length === 0) {
        const err = AppError.create('All Fields are required', 400, FAIL);
        return next(err);
    }

    if (itemPrice < 0 || taxPrice < 0 || shippingPrice < 0 || totalPrice < 0) {
        const err = AppError.create('Prices cannot be negative', 400, FAIL);
        return next(err);
    }
    for (let item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            const err = AppError.create(`Product with ID ${item.product} not found`, 400, FAIL);
            return next(err);
        }
        if (item.quantity > product.countInStock) {
            const err = AppError.create(`Not enough stock for product ${product.name}`, 400, FAIL);
            return next(err);
        }
    }
    const order = new Order({
        user: req.user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    });
    const createdOrder = await order.save();
    for (let item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
            product.countInStock -= item.quantity;
            await product.save();
        }
    }
    res.status(201).json({ status: SUCCESS, message: "Order created successfully", data: { order: createdOrder } });
});

const getMyOrders = asyncWrapper(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ status: SUCCESS, message: "Orders fetched successfully", data: { orders: orders } });
});

const getOrderById = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        const err = AppError.create('Order not found', 404, FAIL);
        return next(err);
    }
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
        return res.status(200).json({ status: SUCCESS, message: "Order fetched successfully", data: { order: order } });
    } else {
        const err = AppError.create("You do not have permission to view this order", 403, FAIL);
        return next(err);
    }

});

const makeOrderAsPaid = asyncWrapper(async (req, res) => {

    const order = await Order.findById(req.params.id);
    if (!order) {
        const err = AppError.create('Order not found', 404, FAIL);
        return next(err);
    }

    if (req.user._id.toString() !== order.user.toString() && !req.user.isAdmin) {
        const err = AppError.create("You do not have permission to update this order", 403, FAIL);
        return next(err);
    }
    if (order.isPaid) {
        const err = AppError.create("Order is already paid", 400, FAIL);
        return next(err);
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = { // I will modify it later based on Payment gateway
        id: req.user.id || 'manual',
        status: req.user.status || 'completed',
        update_time: new Date().toISOString(),
        email_address: req.user.email,
    };

    const updatedOrder = await order.save();

    res.status(200).json({
        status: SUCCESS,
        message: "Order payment status updated",
        data: { order: updatedOrder }
    });
});

const markOrderAsDelivered = asyncWrapper(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        const err = AppError.create('Order not found', 404, FAIL);
        return next(err);
    }
    if (order.isDelivered) {
        const err = AppError.create("Order is already delivered", 400, FAIL);
        return next(err);
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(200).json({ status: SUCCESS, message: "Order marked as delivered", data: { order: updatedOrder } });
});

const getAllOrders = asyncWrapper(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ status: SUCCESS, message: "Orders fetched successfully", data: { orders: orders } });
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    makeOrderAsPaid,
    markOrderAsDelivered,
    getAllOrders,
}