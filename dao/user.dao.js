const AWS = require('../config/aws.config')
const uniqid = require('uniqid');
const userDAO = new AWS.DynamoDB.DocumentClient()
const saltRounds = 10;
let params;
let data;
const table = 'users';
const PRE_FIX = 'u'

// CREATE
const registerUser = async (user) => {
    
    const password = require('bcrypt').hashSync(user.password, saltRounds);
    params = {
        TableName: table,
        Item: {
            userID: PRE_FIX + uniqid(),
            email: user.email,
            password,
            firstName: user.firstName,
            lastName: user.lastName,
            role: "user"
        }
    };
    
    userDAO.put(params, (err) => {
        if (err) {
            console.error(err);
            throw new Error("Database connection error");
        } else {
            console.log("registered user");
        }
    });
};

// READ

async function getUserByEmail(email) {
    const params = {
        TableName: table,
        IndexName: 'email-index',
        KeyConditionExpression: '#email = :email',
        ExpressionAttributeNames: {
            '#email': 'email'
        },
        ExpressionAttributeValues: {
            ':email': email
        }
    };

    try {
        const data = await userDAO.query(params).promise();
        return data.Items[0];
    } catch (err) {
        throw new Error('Error getting user by email from database');
    }
}

function retrieveUserById(userID) {
    return userDAO.get({
        TableName: table,
        Key: {
            'userID': userID
        }
    }).promise();
}

// UPDATE
async function updateUser(user, userID) {

    const password = require('bcrypt').hashSync(user.password, saltRounds);
    const params = {
        TableName: table,
        Key: {
            'userID': userID
        },
        UpdateExpression: 'set #email = :email, #password = :password, #firstName = :firstName, #lastName = :lastName',
        ExpressionAttributeNames: {
            '#email': 'email',
            '#password': password,
            '#firstName': 'firstName',
            '#lastName': 'lastName'
        },
        ExpressionAttributeValues: {
            ':email': user.email,
            ':password': password,
            ':firstName': user.firstName,
            ':lastName': user.lastName
        },
        ReturnValues: 'ALL_NEW'
    };

    try {
        const data = await userDAO.update(params).promise();
        return data.Attributes;
    } catch (err) {
        throw new Error('Error updating user in database');
    }
}

// DELETE

module.exports = { registerUser, getUserByEmail, retrieveUserById, updateUser}