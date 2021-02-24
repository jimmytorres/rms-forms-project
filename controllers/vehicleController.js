var Vehicle = require('../models/vehicle');
var async = require('async');
var People = require('../models/people');

const { body,validationResult } = require('express-validator');

// Display list of all Vehicles.
exports.vehicle_list = function (req, res, next) {

    Vehicle.find()
        .sort([['model_name', 'ascending']])
        .exec(function (err, list_vehicles) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('vehicle_list', { title: 'Vehicle List', vehicle_list: list_vehicles });
        });

};

// Display detail page for a specific Author.
exports.vehicle_info = function (req, res, next) {

    async.parallel({
        vehicle: function (callback) {
            Vehicle.findById(req.params.id)
                .exec(callback)
        },
        vehicles_peoples: function (callback) {
            People.find({ 'vehicle': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.vehicle == null) { // No results.
            var err = new Error('Vehicle not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('vehicle_detail', { title: 'Vehicle Detail', vehicle: results.vehicle, vehicle_peoples: results.vehicles_peoples });
    });

};

// Display Author create form on GET.
exports.vehicle_create_get = function(req, res, next) {
    res.render('vehicle_form', { title: 'Create Vehicle'});
};

// Handle Author create on POST.
exports.vehicle_create_post = [

    //NEEDS CHANGING
    // Validate and sanitize fields.
    body('plate_number').trim().isLength({ max: 7 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('vehicle_color').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('vehicle_year').trim().isLength({ min: 1 }).escape().withMessage('Year of car must be specefied')
        .isAlphanumeric().withMessage('Car year has numbers only'),
    // body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    // body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create Author object with escaped and trimmed data
        var vehicle = new Vehicle(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('vehicle_form', { title: 'Create Vehicle', vehicle: vehicle, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            vehicle.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(vehicle.url);
            });
        }
    }
];

// Display Author delete form on GET.
exports.vehicle_delete_get = function (req, res, next) {

    async.parallel({
        vehicle: function (callback) {
            vehicle.findById(req.params.id).exec(callback)
        },
        vehicles_books: function (callback) {
            People.find({ 'vehicle': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.vehicle == null) { // No results.
            res.redirect('/catalog/vehicles');
        }
        // Successful, so render.
        res.render('vehicle_delete', { title: 'Delete Vehicle', vehicle: results.vehicle, vehicle_peoples: results.vehicles_peoples });
    });

};


// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.authors_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list.
                res.redirect('/catalog/authors')
            })

        }
    });

};

// Display Author update form on GET.
exports.vehicle_update_get = function (req, res, next) {

    Vehicle.findById(req.params.id, function (err, vehicle) {
        if (err) { return next(err); }
        if (vehicle == null) { // No results.
            var err = new Error('Vehicle not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('vehicle_form', { title: 'Update Vehicle', vehicle: vehicle });

    });
};

// Handle Author update on POST.
exports.vehicle_update_post = [

    // Validate and santize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var vehicle = new Vehicle(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('vehicle_form', { title: 'Update Vehicle', vehicle: vehicle, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Vehicle.findByIdAndUpdate(req.params.id, vehicle, {}, function (err, thevehicle) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thevehicle.url);
            });
        }
    }
];