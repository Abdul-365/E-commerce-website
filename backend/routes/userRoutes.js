import {
    addAddress,
    addPayMethod,
    addToCart,
    createCustomer,
    createSeller,
    currentUserDetails,
    customerList,
    deleteAddress,
    deletefromCart,
    deletePayMethod,
    deleteUser,
    displayUser,
    login,
    logout,
    sellerList,
    updateAddress,
    updateInCart,
    updatePayMethod,
    updateCustomer,
    updateSeller,
    userOrders,
} from '../controllers/userController';
import multer from 'multer';

const userRoutes = (app) => {
    const upload = multer({ dest: './controllers/uploads/' });

    //-------------------------------- User Authentication --------------------------------

    app.route('/customer/signup')
        .post(upload.single('userImage'), createCustomer);
    app.route('/seller/signup')
        .post(upload.single('companyImage'), createSeller);
    app.route('/user/login')
        .post(login);
    app.route('/user/logout')
        .get(logout);

    //-------------------------------- Manage and View Users --------------------------------

    app.route('/user')
        .get(currentUserDetails);
    app.route('/user/:userId')
        .get(displayUser)
        .delete(deleteUser);
    app.route('/user/:userId/orders')
        .get(userOrders);
    app.route('/customer/:customerId')
        .put(upload.single('userImage'), updateCustomer)
    app.route('/seller/:sellerId')
        .put(upload.single('userImage'), updateSeller)
    app.route('/customers')
        .get(customerList);
    app.route('/sellers')
        .get(sellerList);

    //-------------------------------- Manage User Addresses --------------------------------

    app.route('/user/:userId/address')
        .put(addAddress);
    app.route('/user/:userId/address/:addressId')
        .put(updateAddress)
        .delete(deleteAddress);

    //-------------------------------- Manage Customer Cart --------------------------------

    app.route('/customer/:customerId/cart')
        .put(addToCart);
    app.route('/customer/:customerId/cart/:productId')
        .put(updateInCart)
        .delete(deletefromCart);
}

export default userRoutes;