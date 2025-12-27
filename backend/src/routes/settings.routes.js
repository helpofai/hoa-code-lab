const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const auth = require('../middlewares/auth.middleware');
const role = require('../middlewares/role.middleware');

router.get('/', settingsController.getSettings);
router.put('/', auth, role(['admin']), settingsController.updateSettings);

module.exports = router;
