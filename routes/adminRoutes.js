const express = require('express');
const { adminLogin } = require('../controllers/adminController');
const { getTotalRegisteredUsers } = require('../controllers/adminController');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.post('/adminlogin', adminLogin);
router.get('/users/total', getTotalRegisteredUsers);


// Route to get the total registered users count
router.get('/users/total', adminController.getTotalRegisteredUsers);

module.exports = router;
