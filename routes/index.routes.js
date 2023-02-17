const productRouter = require("./product.routes");
const userRouter = require("./user.routes");

const routesList = [
    productRouter,
    userRouter
]

module.exports = routesList;