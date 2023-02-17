const orderDao = require('../dao/order.dao');

async function createOrder(order) {
    if(!order.userID || !order.orders || !order.totalPrice) {
        throw new Error("Not enough product information");
    }
    return orderDao.createOrder(order);
}

async function getOrdersByUserId(userID) {
    try {
        const orders = await orderDao.getOrdersByUserId(userID);
        if (orders.Items && Object.keys(orders.Items).length !== 0) {
            return orders.Items;
        }
        throw new Error(`User with ID ${userID} not found`);
    } catch(error) {
        throw error;
    }
}

module.exports = { createOrder, getOrdersByUserId };
