const express = require('express');
const router = express.Router();
const userController = require('../controllers/signupController');

router.post('/signup', userController.signup);


module.exports = router;
