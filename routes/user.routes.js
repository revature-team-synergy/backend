//Imports
const router = require('express').Router();
const userDao = require('../dao/user.dao');
const jwtUtil = require('../utility/jwt.util');
const login = require('../services/login.service');

router.use("/users", router);

router.get('/:userID', async (req, res) => {
    const user = req.params['userID'];
    try {
        const data = await userDao.retrieveUserById(user);
        if (data.Item) {
            res.send(data.Item);
        } else {
            res.status(404).send({errorMessage: "The user doesn't exist."});
        }
    } catch {
        return res.status(500).send({serverError: 'There was a server error.'});
    }
});

router.post('/', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    console.log(user);
    try {
        await userDao.registerUser(user.email, user.password);
        res.send({message: "User Registered"});
    } catch {
        return res.status(500).send({serverError: 'There was a server error.'});
    }
});

router.patch('/:userID', async (req, res) => {
    //This checks for the target user ID.
    const targetUser = req.params['userID'];

    //This checks for the logged-in user.
    const token = req.headers.authorization.split("")[1];
    const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

    //This checks that the target user is the same as the logged-in user.
    if (targetUser !== payload['userID']) {
        return res.status(401).send({errorMessage: "You are not authorized."});
    }

    //This gets the data from the body.
    const {newEmail, newName, newUsername} = req.body;

    //This checks that the data is in the correct format.
    if (typeof newEmail !== 'string' && typeof newName !== 'string' && typeof newUsername !== 'string') {
        return res.status(400).send({clientError: 'Please input a valid email,name and username'});
    }

    try {
        await userDao.editUserInformation(payload.username, newUsername, newEmail, newName);
        res.send({'message': 'Information updated successfully'});
    } catch (err) {
        res.status(500).send({serverError: 'There was a server error.'});
    }

});

router.post('/login', async (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        //This checks that the data is in the correct format.
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).send({errorMessage: 'Please input a valid email and password.'});
        }

        try {
            if (await login(email, password)) {
                const data = await userDao.retrieveUserByEmail(email);
                data.Items[0].password = null;
                console.log(data.Items[0]);
                const token = await jwtUtil.createToken(data.Items[0]);
                 return res.send({
                    message: 'Successful Login',
                    token: token
                });
            } else{
                res.status(404);
                return res.send({errorMessage: 'Invalid credentials.'});
            }

        } catch(err) {
            return res.status(500).send({serverError: 'A server error has occurred.'});
        }
    }
)
;

module.exports = router;