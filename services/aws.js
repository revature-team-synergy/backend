const AWS = require('aws-sdk')
var credentials = new AWS.SharedIniFileCredentials({profile: 'team-synergy'});
AWS.config.credentials = credentials;
// Configure Amazon region
AWS.config.update({region: "us-east-1",});

module.exports = AWS
/**
 * aws configure import --csv file://team-synergy_credentials.csv
 * 
 * References: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
 */

