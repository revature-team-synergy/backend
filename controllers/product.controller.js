const productService = require('../services/product.service');

async function getAllProducts(req, res, next) {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
        next(error);
    }
}

async function getProductById(req, res, next) {
    const productID = req.params['productID'];
    try {
        const product = await productService.getProductById(productID);
        res.status(200).json(product);
    } catch (error) {
        if (error.message == `Product with ID ${productID} not found`) {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error.message);
            next(error);
        }
    }
}

async function createProduct(req, res, next) {
    try {
        const product = {
            category: req.body.category,
            name: req.body.name,
            price: req.body.price,
            description: req.body.description
        }
        res.status(201).json(await productService.createProduct(product));
    } catch (error) {
        res.status(400).json(error.message);
        next(error);
    }
}

async function getProductByCategory(req, res, next) {
    try {
        const productCategory = req.params['productCategory'];
        const products = await productService.getProductByCategory(productCategory);
        res.status(200).json(products);
    } catch (error) {
        if (error.message == `Products with Category ${productCategory} not found`) {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error.message);
            next(error);
        }
    }
}

module.exports = { getAllProducts, getProductById, createProduct, getProductByCategory };
