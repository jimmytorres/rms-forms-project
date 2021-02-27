var Vehicle = require('../models/vehicle');

// Display list of all BVehicle.
exports.vehicle_list = function(req, res) {
    Vehicle.find({}, 'title vehicle')
        .populate('vehicle')
        .exec(function (err, list_vehicles) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('vehicle_list', { title: 'Vehicle List', vehicle_list: list_vehicles });
        });
};

// Display detail page for a specific Vehicle.
exports.vehicle_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle detail: ' + req.params.id);
};

// Display Vehicle create form on GET.
exports.vehicle_create_get = function(req, res) {
    res.render('vehicle_form', { title: 'Create Vehicle' });
};

// Handle Vehicle create on POST.
exports.vehicle_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle create POST');
};

// Display Vehicle delete form on GET.
exports.vehicle_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle delete GET');
};

// Handle Vehicle delete on POST.
exports.vehicle_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle delete POST');
};

// Display Vehicle update form on GET.
exports.vehicle_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle update GET');
};

// Handle Vehicle update on POST.
exports.vehicle_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle update POST');
};