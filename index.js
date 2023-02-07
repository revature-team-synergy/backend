//Imports
const app = require('./app');

//Port number
const PORT = 8084;

//Runs the server
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});