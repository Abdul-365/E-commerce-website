import Product from '../models/productModel';
import fs from 'fs';
import path from 'path';
import async from 'async';

export const addProduct = (req, res) => {
    let newProduct = new Product(req.body);
    if (req.files) {
        let files = req.files;
        files.forEach(file => {
            let image = fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename));
            newProduct.images.push({ data: `data:image/image/png;base64,${image.toString('base64')}` });
        })
    }
    newProduct.save((err, product) => {
        if (err) res.send(err);
        res.json(product);
    })
}

export const updateProduct = (req, res) => {
    if (!req.files === []) {
        let files = req.files;
        req.body.images = [];
        files.forEach(file => {
            let image = fs.readFileSync(path.join(__dirname + '/uploads/' + file.filename));
            req.body.images.push({ data: `data:image/image/png;base64,${image.toString('base64')}` });
        })
    }
    Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true, runValidators: true },
        (err, product) => {
            if (err) res.send(err);
            res.json(product)
        });
}

export const deleteProduct = (req, res) => {
    Product.findByIdAndRemove(req.params.productId, (err, product) => {
        if (err) res.send(err);
        res.json({ message: 'Product deleted successfully' });
    })
}

export const displayProduct = (req, res) => {
    async.waterfall([
        function (callback) {
            Product.findById(req.params.productId)
                .populate('reviews.user', 'userImage firstName lastName cart')
                .exec((err, product) => {
                    if (err) callback(err);
                    else callback(null, product);
                });
        },
        function (product, callback) {
            if (req.user) {
                product = JSON.parse(JSON.stringify(product));
                for (const review of product.reviews) {
                    if(review.user.id === req.user.id) {
                        const index = product.reviews.indexOf(review);
                        product.reviews.splice(index, 1);
                        product.currentUserReview = review;
                    }
                }
            }
            callback(null, product);
        }
    ], function (err, product) {
        if(err) res.send(err);
        res.json(product);
    })
}

export const productList = (req, res) => {
    async.parallel(
        {
            products: function (callback) {
                Product.find(
                    { category: req.params.category },
                    'name price images reviews brand')
                    .sort(req.params.sort !== 'none' ? req.params.sort : '')
                    .exec(callback);
            },
            brands: function (callback) {
                Product.find({ category: req.params.category }).distinct('brand', callback);
            },
        },
        function (err, results) {
            if (err) res.send(err);
            else res.json(results);
        }
    );
}

export const productSearch = async (req, res) => {
    try {
        const products = await Product.find(
            { $text: { $search: req.params.term } },
            'name price images reviews brand')
            .sort(req.params.sort !== 'none' ? req.params.sort : '');
        res.json(products);
    } catch (err) {
        res.send(err);
    }
}

export const addReview = (req, res) => {
    Product.findByIdAndUpdate(
        req.params.productId,
        { $push: { reviews: req.body } },
        { new: true },
        (err, product) => {
            if (err) res.send(err);
            res.json(product);
        });
}

export const updateReview = (req, res) => {
    Product.findOneAndUpdate(
        { _id: req.params.productId, "reviews.user": req.params.userId },
        { $set: { "reviews.$.rating": req.body.rating, "reviews.$.description": req.body.description } },
        { new: true },
        (err, product) => {
            if (err) res.send(err);
            res.json(product);
        })
}

export const deleteReview = (req, res) => {
    Product.findOneAndUpdate(
        { _id: req.params.productId, "reviews.user": req.params.userId },
        { $pull: { reviews: { user: req.params.userId } } },
        { new: true },
        (err, product) => {
            if (err) res.send(err);
            res.json(product);
        })
}