const { registerUser, retrieveUserByEmail } = require('../dao/user.dao');
const validator = require("../utility/validator.util")

const register = async (email, password) => {
    
    if (!validator.validateEmail(email)) {
        throw new Error("Please enter a valid email. (ex. example@email.com)");
    }

    const data = await retrieveUserByEmail(email);
      
    if (data.Items.length > 0) {
        throw new Error(`Email ${email} has already been registered`);
    }
    if (password.length < 6) {
        throw new Error("Password length must be at least 8 characters");
    }
    
    registerUser(email, password);
}

module.exports = register

