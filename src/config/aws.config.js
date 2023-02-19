const AWS = require('aws-sdk');
const dotenv = require('dotenv');
// // get config vars
dotenv.config();
const awsConfig = new AWS.Config({
    profile: process.env.USER_NAME, 
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretKeyId: process.env.AWS_SECRET_ACCESS_KEY
});
AWS.config.credentials = awsConfig.credentials;
// Configure Amazon region
AWS.config.update({region: "us-east-1",});

module.exports = AWS;
