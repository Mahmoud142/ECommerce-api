const Order = require('../models/order.model');
const Product = require('../models/product.model');
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
        
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "No order items provided" });
        }
        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            return res.status(400).json({ message: "Invalid shipping address" });
        }
        if(!paymentMethod) {
            return res.status(400).json({ message: "Payment method is required" });
        }
        if (itemPrice < 0 || taxPrice < 0 || shippingPrice < 0 || totalPrice < 0) {
            return res.status(400).json({ message: "Prices cannot be negative" });
        }
        for (let item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.product} not found` });
            }
            if (item.quantity > product.countInStock) {
                return res.status(400).json({ message: `not enough stock for product ${product.name}` });
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
        res.status(201).json({ message: "Order created successfully", order: createdOrder });
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

const makeOrderAsPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if(req.user._id.toString() !== order.user.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: "You do not have permission to update this order" });
        }
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id || 'manual',
            status: req.body.status || 'completed',
            update_time: req.body.update_time || new Date().toISOString(),
            email_address: req.body.email_address || req.user.email,
        };
        const updatedOrder = await order.save();
        res.status(200).json({ message: "Order payment status updated", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order payment status:", error);
        res.status(500).json({ message: "Internal Server Error from orders" });
    }
}

const markOrderAsDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        if (order.isDelivered) {
            return res.status(400).json({ message: "Order is already delivered" });
        }

        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.status(200).json({ message: "Order marked as delivered", order: updatedOrder });
    } catch (error) {
        console.error("internal server error from mark order as deliverd", error);
        res.status(500).json({ message: "Internal Server Error from orders" });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({createdAt: -1});
        res.status(200).json({ orders: orders });
    }catch(error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: "Internal Server Error from orders" });
    }
}
module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    makeOrderAsPaid,
    markOrderAsDelivered,
    getAllOrders,
}