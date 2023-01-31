const express = require('express');

const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
    return res.send({message: 'Welcome to the server.'});
});

app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});