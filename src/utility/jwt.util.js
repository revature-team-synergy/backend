//Imports
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

//This will store the users data into the token that we create. The token lasts for three days.
function createToken(userID, role) {
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3),
        'userID': userID,
        'role' : role
    }, process.env.JWTSECRET);
}

//This function returns a promise that contains the payload when the promise is solved.
function verifyTokenAndReturnPayload(token) {
    try {
        const payload = jwt.verify(token, process.env.JWTSECRET);
        return payload;
    } catch (error) {
        throw new Error('Error verifying token');
    }
}

module.exports = {
    createToken,
    verifyTokenAndReturnPayload
};
