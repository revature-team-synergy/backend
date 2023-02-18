const router = require('express').Router();
const productController = require('../controllers/product.controller');

router.use("/products", router);

router.get("/", productController.getAllProducts);

router.get("/id/:productID", productController.getProductById);

router.post("/", productController.createProduct);

router.get("/category/:productCategory", productController.getProductByCategory);

module.exports = router;