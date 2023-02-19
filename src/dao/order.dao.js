const { AWS, retrieveItemById } = require('./product.dao');
const uniqid = require('uniqid');
const myCache = require("../config/cache");
const orderDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const TableName = 'orders';
const PRE_FIX = 'o'

// CREATE
const createOrder = (order) => {
    const allProducts = myCache.get(order.userID);
    if(allProducts) {
        myCache.del(order.userID);
    }
    params = {
        TableName,
        Item: {
            userID: order.userID,
            orderID: PRE_FIX + uniqid(),
            products: order.products,
            totalPrice: order.totalPrice
        }
    };
    
    orderDAO.put(params, (err) =>{
        if(err) {
            console.error(err);
            throw new Error("Database connection error");
        } else {
            console.log("Successfully created order")
            return true;
        }
    })
};

// READ

const getOrdersByUserId = async (userID) => {
    const allProducts = myCache.get(userID);
    if(allProducts) {
        myCache.ttl(userID, 300);
        return allProducts;
    }

    params = {
        TableName,
        KeyConditionExpression: '#userID = :id',
        ExpressionAttributeNames: {
            '#userID': 'userID'
        },
        ExpressionAttributeValues: {
            ':id': userID
        }
    };
    data = await orderDAO.query(params).promise();
    return data;
}

module.exports = { 
    createOrder,
    getOrdersByUserId
}