const router = require("express").Router();

const userController = require("../controllers/user");

router.post("", userController.createUser);
router.post("/authenticate", userController.authenticateUser);

router.get("", userController.findUserByEmail);

module.exports = router;
