//Imports
const router = require('express').Router();
const userDao = require('../dao/user.dao');
const jwtUtil = require()

router.get('/:userId', async (req, res) => {
    const user = req.params['userId'];
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

router.patch('/:userId', async (req, res) => {
    const user = req.params['userId'];
    const token = req.headers.authorization.split("")[1];
    const payload = await jwtUtil.verifyTokenAndReturnPayload(token);

    if (user !== payload.user) {
        return res.status(401).send({errorMessage: "You are not authorized."});
    }

    const {newEmail, newName, newUsername} = req.body;
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