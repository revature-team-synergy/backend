//Imports
const router = require('express').Router();

//Route imports
const userRoutes = require('./user.routes');


//Index route
router.get('/', (req, res) => {
    return res.send({message: 'Welcome to the synergy server.'});
});

//All routes.
router.use('/users', userRoutes);


//Route not found.
router.use((req, res) => {
    return res.status(404).send({errorMessage: 'This route does not exist.'});
});

module.exports = router;