const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.get('/slots', usersController.getAvailableSlots);
router.post('/slots/register', usersController.registerSlot);
router.put('/slots/update', usersController.updateRegisteredSlot);

module.exports = router;
