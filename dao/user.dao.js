const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const userDAO = new AWS.DynamoDB.DocumentClient()
const saltRounds = 10;
let params;
let data;
const TableName = 'users';

// CREATE
registerUser = async (email, password) => {
    
    password = require('bcrypt').hashSync(password, saltRounds)
    params = {
        TableName,
        Item: {
            userID: uniqid(),
            email,
            password,
            role: "user"
        }
    };
    
    await userDAO.put(params, (err) => {
        if(err) {
            throw new Error("Database connection error");
        } else {
            return true;
        }
    }).promise()
};

// READ

retrieveUserByEmail = async (email) => {
    
    params = {
        TableName,
        IndexName: 'email-index',
        Limit: 1,      
        KeyConditionExpression: "#email = :email",
        ExpressionAttributeNames:{
            "#email": "email"
        },
        ExpressionAttributeValues: {
            ":email":email
        }
    };
    data = await userDAO.query(params).promise()
    return data;

}

// UPDATE

// DELETE

module.exports = { registerUser, retrieveUserByEmail }

registerUser("email1@example.com","password")