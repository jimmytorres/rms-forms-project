var vehicle = require('../models/vehicle');

// Display list of all BookInstances.
exports.vehicle_list = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle list');
};

// Display detail page for a specific BookInstance.
exports.vehicle_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle detail: ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.vehicle_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle create GET');
};

// Handle BookInstance create on POST.
exports.vehicle_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle create POST');
};

// Display BookInstance delete form on GET.
exports.vehicle_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle delete GET');
};

// Handle BookInstance delete on POST.
exports.vehicle_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle delete POST');
};

// Display BookInstance update form on GET.
exports.vehicle_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle update GET');
};

// Handle bookinstance update on POST.
exports.vehicle_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Vehicle update POST');
};