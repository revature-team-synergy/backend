const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const itemDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const TableName = 'products';

// CREATE
createItem = (category, name, price, description) => {
    
    params = {
        TableName,
        Item: {
            itemID: uniqid(),
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

retrieveItems = async () => {  
    params = {
        TableName,
    }
    data = await itemDAO.scan(params).promise()
    return data;

}

retrieveItemsByCategory = async (category) => {
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

retrieveItemById = async (itemID) => {
    params = {
        TableName,
        Key: {
            itemID
        }
    }
    data = await itemDAO.get(params, (err) =>{
        if(err) {
            throw new Error("Database connection error");
        } else {
            console.log(data)
            return data;
        }
    }).promise()
    
}

// UPDATE

// DELETE

deleteItemById = async (itemID) => {
    params = {
        TableName,
        Key: {
            itemID
        }
    }
    data = await itemDAO.delete(params).promise()
    console.log(data)
    return data;
}

module.exports = { 
    createItem,
    retrieveItems, 
    retrieveItemsByCategory,
    retrieveItemById,
    deleteItemById
 }