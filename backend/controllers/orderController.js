import Order from '../models/orderModel';
import { Customer, Seller } from '../models/userModel';
import async from 'async';

export const createOrder = (req, res) => {
    async.waterfall([
        function (callback) {
            Customer.findById(req.body.user)
                .populate('cart.product')
                .exec((err, customer) => {
                    if (err) callback(err);
                    else callback(null, customer.cart);
                });
        },
        function (cart, callback) {
            let newOrders = [];
            for (const item of cart) {
                const subtotal = item.product.price * item.quantity;
                const newOrder = new Order({
                    product: item.product._id,
                    quantity: item.quantity,
                    subtotal: subtotal,
                    shippingCharges: subtotal > 1500 ? 0 : 60,
                    tax: subtotal * 0.2,
                    total: subtotal + (subtotal * 0.18) + (subtotal > 1500 ? 0 : 60),
                    user: req.body.user,
                    address: req.body.address
                })
                newOrders.push(newOrder);
            }
            Order.insertMany(newOrders, { populate: "product" }, (err, orders) => {
                if (err) callback(err);
                else callback(null, orders);
            });
        },
        function (orders, callback) {
            let orderIds = orders.map(order => order._id)
            Customer.findByIdAndUpdate(
                req.body.user,
                { $push: { orders: orderIds }, $set: { cart: [] } },
                { new: true, runVaidators: true },
                (err, customer) => {
                    if (err) callback(err);
                    callback(null, orders, customer);
                });

        },
        function (orders, customer, callback) {
            Promise.all(orders.map(order =>
                Seller.findByIdAndUpdate(
                    order.product.seller,
                    { $push: { orders: order._id } },
                    { new: true, runVaidators: true },
                )))
                .then((sellers) => callback(null, orders, customer, sellers))
                .catch((err) => callback(err));
        }
    ], function (err, orders, customer, sellers) {
        if (err) res.send(err);
        else res.json({ orders: orders, customer: customer, sellers: sellers });
    })
}

export const orderInfo = (req, res) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec((err, order) => {
            if (err) res.send(err);
            res.json(order);
        });
}

export const updateOrder = (req, res) => {
    let dd
    if (req.body.status === 'Delivered')
        dd = new Date();
    Order.findByIdAndUpdate(
        req.params.orderId,
        { status: req.body.status, dateDelivered: dd },
        { new: true, runValidators: true },
        (err, order) => {
            if (err) res.send(err);
            res.json(order);
        });
}

export const orderList = (req, res) => {
    Order.find({}, (err, orders) => {
        if (err) res.send(err);
        res.json(orders);
    });
}

// let sellers = [];
// for (const order of orders) {
//     let seller = await Seller.findByIdAndUpdate(
//         order.product.seller,
//         { $push: { orderLog: order._id } },
//         { new: true, runVaidators: true },
//     )
//     sellers.push(seller);
// }
// callback(null, orders, customer, sellers);