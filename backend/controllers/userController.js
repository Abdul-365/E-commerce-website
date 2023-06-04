import { User, Customer, Seller } from '../models/userModel';
import Product from '../models/productModel';
import fs from 'fs';
import path from 'path';
import passport from 'passport';
import async from 'async';

// -------------------------------- User Authentication --------------------------------

export const currentUserDetails = (req, res) => {
    if (!req.user) res.send();
    else res.json(req.user);
}

export const login = (req, res, next) => {
    passport.authenticate('local', function (err, account) {
        req.logIn(account, function () {
            res.status(err ? 500 : 200).send(err ? err : account);
        });
    })(req, res, next);
}

export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);
        res.json({ message: 'User logged out' });
    });
}

// -------------------------------- Manage and View Users --------------------------------

export const createCustomer = (req, res) => {
    let newUser = new Customer(req.body)
    if (req.file) {
        let file = req.file;
        let image = fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename));
        newUser.userImage = `data:image/image/png;base64,${image.toString('base64')}`;
    }
    newUser.save((err, user) => {
        if (err) res.send(err);
        res.json(user);
    });
}
export const createSeller = (req, res) => {
    let newSeller = new Seller(req.body)
    if (req.file) {
        let file = req.file;
        let image = fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename));
        newSeller.companyImage = `data:image/image/png;base64,${image.toString('base64')}`;
    }
    newSeller.save((err, seller) => {
        if (err) res.send(err);
        res.json(seller);
    });
}

export const updateCustomer = (req, res) => {
    if (req.file) {
        let file = req.file;
        let image = fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename));
        req.body.userImage = `data:image/image/png;base64,${image.toString('base64')}`;
    }
    Customer.findByIdAndUpdate(
        req.params.customerId,
        req.body,
        { new: true, runValidators: true },
        (err, user) => {
            if (err) res.send(err);
            res.json(user);
        });
}

export const updateSeller = (req, res) => {
    if (req.file) {
        let file = req.file;
        let image = fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename));
        req.body.companyImage = `data:image/image/png;base64,${image.toString('base64')}`;
    }
    Seller.findByIdAndUpdate(
        req.params.sellerId,
        req.body,
        { new: true, runValidators: true },
        (err, user) => {
            if (err) res.send(err);
            res.json(user);
        });
}

export const deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId, (err, user) => {
        if (err) res.send(err);
        res.json({ message: 'Account deleted successfully' });
    });
}

export const displayUser = (req, res) => {
    User.findById(req.params.userId, (err, user) => {
        if (err) res.send(err);
        res.json(user);
    });
}

export const userOrders = (req, res) => {
    User.findById(req.params.userId)
        .populate({
            path: 'orders',
            populate: {
                path: 'product'
            }
        })
        .sort({ createdAt: -1 })
        .exec((err, user) => {
            if (err) res.send(err);
            res.json(user.orders);
        })
}

export const customerList = (req, res) => {
    Customer.find({}, (err, customer) => {
        if (err) res.send(err);
        res.json(customer);
    });
}

export const sellerList = (req, res) => {
    Seller.find({}, (err, seller) => {
        if (err) res.send(err);
        res.json(seller);
    });
}

// -------------------------------- Manage User Addresses --------------------------------

export const addAddress = (req, res) => {
    User.findByIdAndUpdate(
        req.params.userId,
        { $push: { "addresses": req.body } },
        { new: true, runValidators: true },
        (err, user) => {
            if (err) res.send(err);
            res.json(user);
        });
}

export const updateAddress = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId, "addresses._id": req.params.addressId },
        { $set: { "addresses.$": req.body } },
        { new: true, runValidators: true },
        (err, user) => {
            if (err) res.send(err);
            res.json(user);
        });
}

export const deleteAddress = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.params.userId, "addresses._id": req.params.addressId },
        { $pull: { addresses: { _id: req.params.addressId } } },
        { new: true },
        (err, user) => {
            if (err) res.send(err);
            res.json(user);
        });
}

// -------------------------------- Manage Customer Cart --------------------------------

export const addToCart = (req, res) => {
    async.waterfall([
        function (callback) {
            Product.findById(req.body.product, (err, product) => {
                if (err) callback(err);
                if (product.quantity < req.body.quantity)
                    callback({ message: 'Not sufficient quantity available' });
                else callback(null);
            });
        },
        function (callback) {
            Product.findByIdAndUpdate(
                req.body.product,
                { $inc: { quantity: -req.body.quantity } },
                { new: true },
                (err, product) => {
                    if (err) callback(err);
                    else callback(null, product);
                });
        },
        function (product, callback) {
            Customer.findByIdAndUpdate(
                req.params.customerId,
                { $push: { cart: req.body } },
                { new: true },
                (err, customer) => {
                    if (err) callback(err);
                    else callback(null, product, customer);
                });
        }
    ], function (err, product, customer) {
        if (err) res.send(err);
        else res.json({ customer: customer, product: product });
    });
}

export const updateInCart = (req, res) => {
    async.waterfall([
        function (callback) {
            if(req.body.quantity < 1) {
                deletefromCart(req, res);
                return;
            }
            Customer.findOne(
                { _id: req.params.customerId, "cart.product": req.params.productId },
                { "cart.$": 1 },
                (err, customer) => {
                    if (err) callback(err);
                    else callback(null, customer, req.body.quantity - customer.cart[0].quantity);
                });
        },
        function (customer, quantity, callback) {
            Product.findById(req.params.productId, (err, product) => {
                if (err) callback(err);
                if (product.quantity < quantity)
                    callback({ message: 'Not sufficient quantity available' });
                else callback(null, customer, quantity);
            });
        },
        function (customer, quantity, callback) {
            Product.findByIdAndUpdate(
                req.params.productId,
                { $inc: { quantity: -quantity } },
                { new: true },
                (err, product) => {
                    if (err) callback(err);
                    else callback(null, customer, product);
                });
        },
        function (customer, product, callback) {
            Customer.findOneAndUpdate(
                { customer, "cart.product": req.params.productId },
                { $set: { "cart.$.quantity": req.body.quantity } },
                { new: true },
                (err, customer) => {
                    if (err) callback(err);
                    else callback(null, customer, product);
                });
        }
    ], function (err, customer, product) {
        if (err) res.send(err);
        else res.json({ customer: customer, product: product });
    });
}

export const deletefromCart = (req, res) => {
    async.waterfall([
        function (callback) {
            Customer.findOne(
                { _id: req.params.customerId, "cart.product": req.params.productId },
                { "cart.$": 1 },
                (err, customer) => {
                    if (err) callback(err);
                    else callback(null, customer.cart[0].quantity, customer);
                });
        },
        function (quantity, customer, callback) {
            Product.findByIdAndUpdate(
                req.params.productId,
                { $inc: { quantity: +quantity } },
                { new: true },
                (err, product) => {
                    if (err) callback(err);
                    else callback(null, customer, product);
                });
        },
        function (customer, product, callback) {
            Customer.findOneAndUpdate(
                { customer, "cart.product": req.params.productId },
                { $pull: { cart: { product: req.params.productId } } },
                { new: true },
                (err, customer) => {
                    if (err) callback(err);
                    else callback(null, customer, product);
                });
        }
    ], function (err, customer, product) {
        if (err) res.send(err);
        else res.json({ customer: customer, product: product });
    });
}