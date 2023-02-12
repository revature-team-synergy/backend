const bcrypt = require('bcrypt');
const { retrieveUserByEmail } = require('../dao/user.dao');
const validator = require("../utility/validator.util")

const login = async (email, password) => {
    
    if (!validator.validateEmail(email)) {
        throw new Error("Please enter a valid email. (ex. example@email.com)");
    }
    
    const data = await retrieveUserByEmail(email);
    
    if (data.Items.length === 0) {
        throw new Error(`Email not registered`);
    }
    const dbPassword = data.Items[0].password;
    
    if (!bcrypt.compareSync(password, dbPassword)) {
        throw new Error("Invalid username or password");
    }
    
    return true
}

module.exports = login

