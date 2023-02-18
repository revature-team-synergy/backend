//Imports
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*'
}));

//Import server configurations
require('./config/server.config')(app);

//Router
const routesList = require('./routes/index.routes');
app.use(...routesList);

module.exports = app;