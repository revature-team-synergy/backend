const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const userDAO = new AWS.DynamoDB.DocumentClient()
const saltRounds = 10;
let params;
let data;
const TableName = 'users';
const PRE_FIX = 'u'

// CREATE
registerUser = async (email, password) => {
    
    password = require('bcrypt').hashSync(password, saltRounds)
    params = {
        TableName,
        Item: {
            userID: PRE_FIX + uniqid(),
            email,
            password,
            role: "user"
        }
    };
    
    await userDAO.put(params, (err) => {
        if(err) {
            throw new Error("Database connection error");
        } else {
            console.log("registered user")
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

function retrieveUserById(userID) {
    return userDAO.get({
        TableName: 'users',
        Key: {
            'userID': userID
        }
    }).promise();
}

// UPDATE

function editUserInformation(userId, newUsername, newEmail, newName) {
    return userDAO.update({
        TableName: 'users',
        Key: {
            userId
        },
        UpdateExpression: 'set#a=:value1,#b=:value2,#c=:value3',
        ExpressionAttributeNames: {
            "#a": 'username',
            "#b": 'email',
            "#c": "name"
        },
        ExpressionAttributeValues: {
            ":value1": newUsername,
            ":value2": newEmail,
            ":value3": newName
        },

        ReturnValues: "UPDATED_NEW"
    }).promise();
}

// DELETE

module.exports = { registerUser, retrieveUserByEmail, retrieveUserById, editUserInformation}

registerUser("email@example.com","password")