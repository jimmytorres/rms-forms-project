var Vehicle = require('../models/vehicle');

const { body, validationResult } = require('express-validator');
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
exports.vehicle_create_post = [

    // Validate and sanitize fields.
    body('plate_number').trim().isLength({ min: 1, max: 7 }).escape().withMessage('Plate number must be specified.')
        .isAlphanumeric().withMessage('Plate number has alphanumeric characters.'),
    body('vehicle_color').trim().isLength({ max: 3 }).escape().withMessage('Vehicle color must be specified.')
        .isAlphanumeric().withMessage('Vehicle color has non-alphanumeric characters.'),
    body('vehicle_year').trim().isLength({ min: 4, max: 4 }).escape().withMessage('Vehicle year must be specified.')
        .isAlphanumeric().withMessage('Vehicle year has numeric characters.'),
    body('vehicle_make').trim().isLength({ min: 1 }).escape().withMessage('Vehicle make must be specified.')
        .isAlphanumeric().withMessage('Vehicle make has alphanumeric characters.'),
    body('vehicle_model').trim().isLength({ min: 1 }).escape().withMessage('Vehicle model must be specified.')
        .isAlphanumeric().withMessage('Vehicle model has alphanumeric characters.'),
    body('vehicle_body_type').trim().isLength({ max: 2}).escape().withMessage('Vehicle body type must be specified.')
        .isAlphanumeric().withMessage('Vehicle body type has alphanumeric characters.'),
    body('vehicle_details').trim().isLength({ min: 1}).escape().withMessage('Vehicle details must be specified.')
        .isAlphanumeric().withMessage('Vehicle details has non-alphanumeric characters.'),
    body('vehicle_vin').trim().isLength({ min: 1, max: 17 }).escape().withMessage('Vehicle vin must be specified.')
        .isAlphanumeric().withMessage('Vehicle vin has numeric characters.'),
    body('vehicle_registration').trim().isLength({ min: 1 }).escape().withMessage('Vehicle registration must be specified.')
        .isAlphanumeric().withMessage('Vehicle registration has non-alphanumeric characters.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Person object with escaped and trimmed data
        var vehicle = new Vehicle(
            {
                plate_number: req.body.plate_number,
                vehicle_color: req.body.vehicle_color,
                vehicle_year: req.body.vehicle_year,
                vehicle_make: req.body.vehicle_make,
                vehicle_model: req.body.vehicle_model,
                vehicle_body_type: req.body.vehicle_body_type,
                vehicle_details: req.body.vehicle_details,
                vehicle_vin: req.body.vehicle_vin,
                vehicle_registration: req.body.vehicle_registration,

            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('vehicle_form', { title: 'Create Vehicle', vehicle: vehicle, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save incident.
            vehicle.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(vehicle.url);
            });
        }
    }
];

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