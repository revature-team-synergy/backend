const productDao = require('../dao/product.dao');

async function getAllProducts() {
    try {
        const products = await productDao.getAllProducts();
        return products;
    } catch (error) {
        throw error;
    }
}

async function getProductById(productID) {
    try {
        const product = await productDao.retrieveProductById(productID);
        if (product.Item && Object.keys(product.Item).length !== 0) {
            return product.Item;
        }
        throw new Error(`Product with ID ${productID} not found`);
    } catch(error) {
        console.error(error);
        throw error;
    }
}

async function createProduct(product) {
    if(!product.category || !product.name || !product.price || !product.description) {
        throw new Error("Not enough product information");
    }
    return productDao.createProduct(product);
}

async function getProductByCategory(productCategory) {
    try {
        const product = await productDao.retrieveProductsByCategory(productCategory);
        if (product.Items && Object.keys(product.Items).length !== 0) {
            return product.Items;
        }
        throw new Error(`Products with Category ${productCategory} not found`);
    } catch(error) {
        throw error;
    }
}

module.exports = { getAllProducts, getProductById, createProduct, getProductByCategory };
