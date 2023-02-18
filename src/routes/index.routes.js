const productRouter = require("./product.routes");
const userRouter = require("./user.routes");
const orderRouter = require("./order.routes");

const routesList = [
    productRouter,
    orderRouter,
    userRouter
]

module.exports = routesList;