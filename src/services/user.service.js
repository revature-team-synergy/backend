const bcrypt = require('bcrypt');
const validator = require("../utility/validator.util")
const userDao = require('../dao/user.dao');

async function registerUser(user) {
    if (!validator.validateEmail(user.email)) {
        throw new Error("Please enter a valid email. (ex. example@email.com)");
    }

    const data = await userDao.getUserByEmail(user.email);

    if (data) {
        throw new Error(`Email ${user.email} has already been registered`);
    }
    if (user.password.length < 8) {
        throw new Error("Password length must be at least 8 characters");
    }

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
        throw new Error("Not enough user information");
    }

    return userDao.registerUser(user);
};

async function login(email, password) {

    const data = await userDao.getUserByEmail(email);

    if (!data) {
        return null;
    }
    const dbPassword = data.password;

    if (!bcrypt.compareSync(password, dbPassword)) {
        return null;
    }
    return data;
}

async function getUserById(userId) {
    try {
        const user = await userDao.retrieveUserById(userId);
        if (user.Item && Object.keys(user.Item).length !== 0) {
            delete user.Item.password;
            return user.Item;
        }
        throw new Error(`User with ID ${userId} not found`);
    } catch (error) {

        throw error;
    }
}

async function updateUser(user, userID) {
    const existingUser = await userDao.getUserByEmail(user.email);

    if (existingUser && existingUser.userID !== userID) {
        throw new Error('Email address is already taken');
    }

    try {
        const updatedUser = await userDao.updateUser(user, userID);
        return updatedUser;
    } catch (err) {
        throw new Error('Error updating user in database');
    }
}

module.exports = { login, registerUser, getUserById, updateUser };
