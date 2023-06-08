import {
    createOrder,
    orderInfo,
    orderList,
    updateOrder,
    userOrder,
} from '../controllers/orderController';

const orderRoutes = (app) => {

    app.route('/order')
        .post(createOrder);
    
    app.route('/orders')
        .get(orderList);

    app.route('/order/:orderId')    
        .get(orderInfo)
        .put(updateOrder);

    app.route('/order/user/:userId')
        .get(userOrder);

}

export default orderRoutes;