const { registerUser, retrieveUserByEmail } = require('../dao/user.dao');

register = async (email, password) => {
    
    if (email.length < 4) {
        throw new Error(`Username/email: ${email} too short`);
    }

    const data = await retrieveUserByEmail(email);
      
    if (data.Items.length > 0) {
        throw new Error(`Username/Email ${email} has already been registered`);
    }
    if (password.length < 6) {
        throw new Error("Password length must be at least 6 characters");
    }
    
    registerUser(email, password);
}

module.exports = register

