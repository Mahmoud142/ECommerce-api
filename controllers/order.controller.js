const Product = require('../models/product.model');
const Cart = require('../models/cart.model');
const Order = require('../models/order.model');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

//@desc Update order to delivered
//@route PUT /api/orders/:id/deliver
//@access Protected/user-admin
exports.updateOrderToDelivered = asyncWrapper(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(AppError.create('Order not found', 404, FAIL));
    }
    // console.log(req.get('host'));
    console.log(`${req.protocol}://${req.get('host')}/api/orders`);
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json({
        status: SUCCESS,
        message: 'Order updated to delivered successfully',
        data: updatedOrder
    })
})


//@desc Create checkout session
//@route POST /api/orders/checkout-session/:cartId
//@access Protected/User
exports.checkoutSession = asyncWrapper(async (req, res, next) => {
    
    const taxPrice = 0;
    const shippingPrice = 0;


    const cart = await Cart.findById(req.params.cartId);
    if (!cart) {
        return next(AppError.create('Cart not found', 404, FAIL));
    }

    const cartPrice = cart.totalAfterDiscount ? cart.totalAfterDiscount : cart.totalPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                name: req.user.name,
                amount: totalOrderPrice * 100,
                currency: 'egp',
                quantity: 1,
            }
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/api/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/cart`,
        customer_email: req.user.email,
        client_reference_id: req.params.cartId,
        metadata: req.body.shippingAddress,
    });

    res.status(200).json({
        status: SUCCESS,
        message: 'Checkout session created successfully',
        session
    });
})

const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = session.metadata;
    const orderPrice = session.amount_total / 100;

    const cart = await Cart.findById(cartId);
    const user = await User.findById({ email: session.customer_email });
    
    const order = await Order.create({
        user: user._id,
        cartItems: cart.products,
        shippingAddress,
        totalOrderPrice: orderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethodType: 'card',
    })

    // update products quantity

    if (order) {
        const bulkOptions = cart.products.map(product => ({
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { quantity: -product.quantity } }
            }
        }));

        await Product.bulkWrite(bulkOptions);

        await Cart.findByIdAndDelete(cartId);
    }
}

//@desc Stripe webhook for checkout
//@route POST /api/orders/webhook-checkout
//@access Protected/User
exports.webhookCheckout = asyncWrapper(async (req, res, next) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        createCardOrder(event.data.object);
    }
    res.status(200).json({ received: true });
})
