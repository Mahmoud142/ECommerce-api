const Order = require('../models/order.model');

const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice } = req.body;
        // Validate user authentication
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        // Validate required fields
        if (
            !Array.isArray(orderItems) || orderItems.length === 0 ||
            typeof shippingAddress !== 'object' || !shippingAddress ||
            typeof paymentMethod !== 'string' || !paymentMethod.trim() ||
            typeof itemPrice !== 'number' || itemPrice < 0 ||
            typeof taxPrice !== 'number' || taxPrice < 0 ||
            typeof shippingPrice !== 'number' || shippingPrice < 0 ||
            typeof totalPrice !== 'number' || totalPrice < 0
        ) {
            return res.status(400).json({ message: "Missing or invalid required order fields" });
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
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Internal Server Error from orders" });
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ orders: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Internal Server Error from orders" });
    }
}

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        console.log("Order fetched:", order);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
            return res.status(200).json({ order: order });
        } else {
            return res.status(403).json({ message: "You do not have permission to view this order" });
        }
    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ message: "Internal Server Error from orders" });
    }
}
module.exports = {
    createOrder,
    getMyOrders,
    getOrderById
}