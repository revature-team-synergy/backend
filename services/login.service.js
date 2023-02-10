const bcrypt = require('bcrypt');
const { retrieveUserByEmail } = require('../dao/user.dao');
const validator = require("../utility/validator.util")

login = async (email, password) => {
    
    const data = await retrieveUserByEmail(email);
    
    if (data.Items.length === 0) {
        // If database returns empty list
        throw new Error(`Email not registered`);
    }
    const dbPassword = data.Items[0].password;
    
    if (!bcrypt.compareSync(password, dbPassword)) {
        throw new Error("Invalid username or password");
    }
    
    return true
}

module.exports = login

