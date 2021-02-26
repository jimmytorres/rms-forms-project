var express = require('express');
var router = express.Router();

// Require controller modules.
var people_controller = require('../controllers/peopleController');
var vehicle_controller = require('../controllers/vehicleController');
/// INCEDENT ROUTES ///
 router.get('/people/create', people_controller.people_create_get);

// // POST request for creating People.
 router.post('/people/create', people_controller.people_create_post);

// // GET request to delete People.
 router.get('/people/:id/delete', people_controller.people_delete_get);

// // POST request to delete People.
 router.post('/people/:id/delete', people_controller.people_delete_post);

// // GET request to update People.
 router.get('/people/:id/update', people_controller.people_update_get);

// // POST request to update People.
 router.post('/people/:id/update', people_controller.people_update_post);

// // GET request for one People.
 router.get('/people/:id', people_controller.people_detail);

// // GET request for list of all Peoples.
 router.get('/peoples', people_controller.people_list);

router.get('/vehicle/create', vehicle_controller.vehicle_create_get);

//POST request for creating Vehicle.
router.post('/vehicle/create', vehicle_controller.vehicle_create_post);

// GET request to delete Vehicle.
router.get('/vehicle/:id/delete', vehicle_controller.vehicle_delete_get);

// POST request to delete Vehicle.
router.post('/vehicle/:id/delete', vehicle_controller.vehicle_delete_post);

// GET request to update Vehicle.
router.get('/vehicle/:id/update', vehicle_controller.vehicle_update_get);

// POST request to update Vehicle.
router.post('/vehicle/:id/update', vehicle_controller.vehicle_update_post);

// GET request for one Vehicle.
router.get('/vehicle/:id', vehicle_controller.vehicle_detail);

// GET request for list of all Vehicle.
router.get('/vehicles', vehicle_controller.vehicle_list);


// GET catalog home page.
router.get('/', people_controller.index);

module.exports = router;