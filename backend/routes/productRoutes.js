import {
    productList,
    addProduct,
    displayProduct,
    updateProduct,
    deleteProduct,
    addReview,
    updateReview,
    deleteReview,
    productSearch
} from '../controllers/productController';
import multer from 'multer';

const productRoutes = (app) => {
    const upload = multer({ dest: './controllers/uploads/' });

    // user
    app.route('/products/category/:category/:sort')
        .get(productList);
    app.route('/products/search/:term/:sort')
        .get(productSearch)
    app.route('/product/:productId')
        .get(displayProduct)
    app.route('/product/:productId/review')
        .put(addReview);
    app.route('/product/:productId/review/:userId')
        .put(updateReview)
        .delete(deleteReview);

    // admin       
    app.route('/product')
        .post(upload.array("images"), addProduct);
    app.route('/product/:productId')
        .put(upload.array("images"), updateProduct)
        .delete(deleteProduct);
}

export default productRoutes;