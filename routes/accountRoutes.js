const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authenticateToken = require('../middleware/authenticateToken');

router.put('/updatePassword', authenticateToken, accountController.updatePassword);

router.get('/users', authenticateToken, accountController.getAllUsers);

router.get('users1' , authenticateToken , accountController.getUsers) ;

module.exports = router;
