//Imports
const router = require('express').Router();

router.get('/', (req, res)=>{
    res.send({message: 'You reached the /users endpoint.'})
});

module.exports = router;