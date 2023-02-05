const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const orderDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const TableName = 'orders';

// CREATE

createOrder = (userID) => {  
    params = {
        TableName,
        Item: {
            userID,
            orderID: uniqid(),
            items: [],
            total: 0,
            paid: false
        }
    };
    
    orderDAO.put(params, (err) =>{
        if(err) {
            throw new Error("Database connection error");
        } else {
            console.log("Successfully created order")
            return true;
        }
    })
};

// READ

retrieveOrderByUserId = async (userID) => {
    params = {
        TableName,
        Limit: 1,
        KeyConditionExpression: '#userID = :id',
        ExpressionAttributeNames: {
            '#userID': 'userID'
        },
        ExpressionAttributeValues: {
            ':id': userID
        }
    };
    data = await orderDAO.query(params).promise();
    console.log(data)
    return data;
}


retrievePreviousOrders = async (userID) => {
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
    console.log(data)
    return data;
}


// UPDATE


// // DELETE

// deleteOrderById = async (orderID) => {
//     params = {
//         TableName,
//         Key: {
//             itemID
//         }
//     }
//     data = await orderDAO.delete(params).promise()
//     console.log(data)
//     return data;
// }

module.exports = { 
    createOrder,
    retrievePreviousOrders, 
    retrieveOrderByUserId,
    // retrieveItemById,
    // deleteItemById
 }


