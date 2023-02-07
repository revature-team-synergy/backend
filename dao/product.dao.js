const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const itemDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const TableName = 'products';
const PRE_FIX = 'p'

// CREATE
const createItem = (category, name, price, description) => {
    
    params = {
        TableName,
        Item: {
            itemID: PRE_FIX + uniqid(),
            category,
            name,
            price,
            description
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
const retrieveItems = async () => {  
    params = {
        TableName,
    }
    data = await itemDAO.scan(params).promise()
    return data;

}

const retrieveItemsByCategory = async (category) => {
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

const retrieveItemById = async (itemID) => {
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
    createItem,
    retrieveItems, 
    retrieveItemsByCategory,
    retrieveItemById,
    deleteItemById
 }