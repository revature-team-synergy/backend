const router = require('express').Router();
const orderController = require('../controllers/order.controller');

router.use("/orders", router);

router.get("/", orderController.getOrdersByUserId);

router.post("/", orderController.createOrder);

module.exports = router;