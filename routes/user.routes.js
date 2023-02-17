const router = require('express').Router();
const userController = require('../controllers/user.controller');

router.use("/users", router);

router.get("/", userController.getCurrentUser);

router.get("/:userID", userController.getUserById);

router.post("/", userController.registerUser);

router.post("/login", userController.login);

router.put("/:userID", userController.updateUser);

module.exports = router;