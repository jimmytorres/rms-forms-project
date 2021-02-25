var express = require('express');
var router = express.Router();

// Require controller modules.
var people_controller = require('../controllers/peopleController');

/// INCEDENT ROUTES ///

// GET catalog home page.
router.get('/', people_controller.index);

module.exports = router;