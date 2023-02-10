const { AWS, retrieveItemById } = require('./product.dao');
const uniqid = require('uniqid');
const orderDAO = new AWS.DynamoDB.DocumentClient()
let params;
let data;
const TableName = 'orders';
const PRE_FIX = 'o'

// CREATE
const createOrder = (userID) => {  
    params = {
        TableName,
        Item: {
            userID,
            orderID: PRE_FIX + uniqid(),
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
const retrieveOrderByUserId = async (userID) => {
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
    return data;
}

const retrieveUserByOrderId = async (orderID) => {
    params = {
        TableName,
        IndexName: 'orderID-index',
        KeyConditionExpression: '#orderID = :orderID',
        ExpressionAttributeNames: {
            '#orderID': 'orderID'
        },
        ExpressionAttributeValues: {
            ':id': orderID
        }
    };
    data = await orderDAO.query(params).promise();
    return data;
}


const retrievePreviousOrders = async (userID) => {
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


// UPDATE

const addItem = async (userID, itemID) => {
    // Get item from dynamobd
    const item = await retrieveItemById(itemID)
    // Get item from dynamobd
    const order = await retrieveOrderByUserId(userID)
    // Get orderID from order
    const orderID = order.Items[0].orderID
    // Get price from item
    const price = item.Item.price
    let items = order.Items[0].items
    items.push(itemID)
    
    // Update order with items and total    
    const total = order.Items[0].total + price
   
    params = {
        TableName,
        Key: {
            userID,
            orderID
          },
        UpdateExpression: 'set #items = :items, #total = :total',
        ExpressionAttributeNames: {
            '#items': 'items',
            '#total': 'total'

        },
        ExpressionAttributeValues: {
            ':items': items,
            ':total': total
        }
    }
    console.log(params)
    
    await orderDAO.update(params).promise()
    //console.log(params)
}

const removeItem = async (userID, itemID) => {
    // Get item from dynamobd
    const item = await retrieveItemById(itemID)
    // Get item from dynamobd
    const order = await retrieveOrderByUserId(userID)
    // Get orderID from order
    const orderID = order.Items[0].orderID
    // Get price from item
    const price = item.Item.price
    let items = order.Items[0].items
    const index = items.indexOf(itemID);
    items.splice(index, 1);   
    // Update order with items and total    
    const total = order.Items[0].total - price

    params = {
        TableName,
        Key: {
            userID,
            orderID
          },
        UpdateExpression: 'set #items = :items, #total = :total',
        ExpressionAttributeNames: {
            '#items': 'items',
            '#total': 'total'

        },
        ExpressionAttributeValues: {
            ':items': items,
            ':total': total
        }
    }
    
    await orderDAO.update(params).promise()
    //console.log(params)
}

const purchaseOrder = async (userID) => {
    // Get item from dynamobd
    const order = await retrieveOrderByUserId(userID)
    // Get orderID from order
    const orderID = order.Items[0].orderID
   
    params = {
        TableName,
        Key: {
            userID,
            orderID
          },
        UpdateExpression: 'set #paid = :paid',
        ExpressionAttributeNames: {
            '#paid': 'paid'
        },
        ExpressionAttributeValues: {
            ':paid': true
        }
    }
    await orderDAO.update(params).promise()
}

// DELETE
const deleteOrderById = async (orderID) => {
    // DELETE
}

module.exports = { 
    createOrder,
    retrievePreviousOrders, 
    retrieveOrderByUserId,
    addItem,
    removeItem,
    purchaseOrder
    // deleteOrderById
 }
 