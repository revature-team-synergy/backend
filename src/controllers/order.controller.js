const orderService = require('../services/order.service');
const jwtUtil = require('../utility/jwt.util');

async function createOrder(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = await jwtUtil.verifyTokenAndReturnPayload(token);
        const order = {
            userID: payload['userID'],
            products: req.body.products,
            totalPrice: req.body.totalPrice
        }
        res.status(201).json(await orderService.createOrder(order));
    } catch (error) {
        res.status(400).json(error.message);
        next(error);
    }
}

async function getOrdersByUserId(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwtUtil.verifyTokenAndReturnPayload(token);
        try {
            const orders = await orderService.getOrdersByUserId(payload['userID']);
            res.status(200).json(orders);
        } catch (error) {
            if (error.message == `User with ID ${payload['userID']} not found`) {
                res.status(404).json({ message: error.message });
            } else {
                console.error(error.message);
                next(error);
            }
        }
    } catch (error) {
        res.status(400).json({ errorMessage: error.message });
        next(error);
    }
}

module.exports = { createOrder, getOrdersByUserId };
