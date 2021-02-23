var express = require('express');
var router = express.Router();

// Require controller modules.
var people_controller = require('../controllers/peopleController');
var vehicle_controller = require('../controllers/vehicleController');
var incedent_controller = require('../controllers/incedentController');


/// INCEDENT ROUTES ///

// GET catalog home page.
router.get('/', incedent_controller.index);

// GET request for creating an Incedent. NOTE This must come before routes that display Incedent (uses id).
router.get('/incedent/create', incedent_controller.incedent_create_get);

// POST request for creating Incedent.
router.post('/incedent/create', incedent_controller.incedent_create_post);

// GET request to delete Incedent.
router.get('/incedent/:id/delete', incedent_controller.incedent_delete_get);

// POST request to delete Incedent.
router.post('/incedent/:id/delete', incedent_controller.incedent_delete_post);

// GET request to update Icedent.
router.get('/incedent/:id/update', incedent_controller.incedent_update_get);

// POST request to update Icedent.
router.post('/incedent/:id/update', incedent_controller.incedent_update_post);

// GET request for one Icedent.
router.get('/incedent/:id', incedent_controller.incedent_detail);

// GET request for list of all Icedent items.
router.get('/incedents', incedent_controller.incedent_list);

/// PEOPLE ROUTES ///

// GET request for creating People. NOTE This must come before route for id (i.e. display people).
router.get('/people/create', people_controller.people_create_get);

// POST request for creating People.
router.post('/people/create', people_controller.people_create_post);

// GET request to delete People.
router.get('/people/:id/delete', people_controller.people_delete_get);

// POST request to delete People.
router.post('/people/:id/delete', people_controller.people_delete_post);

// GET request to update People.
router.get('/people/:id/update', people_controller.people_update_get);

// POST request to update People.
router.post('/people/:id/update', people_controller.people_update_post);

// GET request for one People.
router.get('/people/:id', people_controller.people_detail);

// GET request for list of all Peoples.
router.get('/peoples', people_controller.people_list);

/// VEHICLE ROUTES ///

// GET request for creating a Vehicle. NOTE This must come before route that displays Vehicles (uses id).
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


module.exports = router;