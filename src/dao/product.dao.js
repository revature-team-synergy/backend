const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const myCache = require("../config/cache");
const itemDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const TableName = 'products';
const PRE_FIX = 'p'

// CREATE
const createProduct = (product) => {
    
    params = {
        TableName,
        Item: {
            itemID: PRE_FIX + uniqid(),
            "category": product.category,
            "name": product.name,
            "price": product.price,
            "description": product.description
        }
    };
    
    itemDAO.put(params, (err) =>{
        if(err) {
            throw new Error("Database connection error");
        } else {
            console.log("Successfully added item")
            return true;
        }
    })
};

// READ
const getAllProducts = async () => {
    const allProducts = myCache.get("allProducts");
    if(allProducts) {
        myCache.ttl("allProducts", 300);
        return allProducts;
    } else {
        params = {
            TableName,
        }
        data = await itemDAO.scan(params).promise();
        myCache.set("allProducts", data, 300);
        return data;
    }
}

const retrieveProductsByCategory = async (category) => {
    params = {
        TableName,
        IndexName: 'category-name-index',
        KeyConditionExpression: '#category = :value',
        ExpressionAttributeNames: {
            '#category': 'category'
        },
        ExpressionAttributeValues: {
            ':value': category
        }
    };
    data = await itemDAO.query(params).promise()
    console.log(data)
    return data;
}

const retrieveProductById = async (itemID) => {
    params = {
        TableName,
        Key: {
            itemID
        }
    }
    data = await itemDAO.get(params, (err) =>{
        if(err) {
            throw new Error("Database connection error");
        }
    }).promise() 
    return data;
}

// UPDATE

// DELETE
const deleteItemById = async (itemID) => {
    params = {
        TableName,
        Key: {
            itemID
        }
    }
    data = await itemDAO.delete(params).promise()
    return data;
}

module.exports = { 
    AWS,
    createProduct,
    getAllProducts, 
    retrieveProductsByCategory,
    retrieveProductById,
    deleteItemById
 }