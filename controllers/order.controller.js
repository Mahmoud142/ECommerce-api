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


module.exports = {
    createOrder
}