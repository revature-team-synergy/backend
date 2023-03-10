const userService = require('../services/user.service');
const jwtUtil = require('../utility/jwt.util');

async function getCurrentUser(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwtUtil.verifyTokenAndReturnPayload(token);
        try {
            const user = await userService.getUserById(payload['userID']);
            res.status(200).json(user);
        } catch (error) {
            if (error.message == `User with ID ${payload['userID']} not found`) {
                res.status(404).json({ message: error.message });
            } else {
                console.error(error.message);
                next(error);
            }
        }
    } catch (error) {
        res.status(400).json({errorMessage: error.message});
        next(error);
    }
}

async function getUserById(req, res, next) {
    const userId = req.params['userID'];
    try {
        const user = await userService.getUserById(userId);
        res.status(200).json(user);

    } catch (error) {
        if (error.message == `User with ID ${userId} not found`) {
            res.status(404).json({ message: error.message });
        } else {
            console.error(error.message);
            next(error);
        }
    }
}

async function registerUser(req, res, next) {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
        res.status(201).json(await userService.registerUser(user));
    } catch (error) {
        res.status(400).json(error.message);
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const user = {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        }
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwtUtil.verifyTokenAndReturnPayload(token);
        try {
            const updatedUser = await userService.updateUser(user, payload['userID']);
            if (!updatedUser) {
                return res.status(404).send({errorMessage: "User not found."});
            }
            delete updatedUser.password;
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({errorMessage: error.message});
            next(error);
        }
    } catch (error) {
        res.status(400).json({errorMessage: error.message});
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await userService.login(email, password);
        if (user) {
            delete user.password;
    
            const token = jwtUtil.createToken(user.userID, user.role);
    
            return res.send({
                message: 'Successful login',
                token: token,
                user: user
            });
        } else {
            res.status(401);
            return res.send({ errorMessage: 'Invalid credentials.' });
        }
    } catch (err) {
        res.status(500);
        return res.send({ serverError: 'A server error has occurred.' });
    }
}

module.exports = { getUserById, registerUser, updateUser, login, getCurrentUser };