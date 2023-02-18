//Imports
const bodyParser = require('body-parser');

//Allows us to access the JSON request body.
module.exports = (app) =>{
    app.use(bodyParser.json())
}