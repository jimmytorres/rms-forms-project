var Incident = require('../models/incident');
var People = require('../models/people');
var async = require('async');
var Vehicle = require('../models/vehicle');

const { body, validationResult } = require('express-validator');

exports.index = function (req, res) {

    async.parallel({
        incident_count: function (callback) {
            Incident.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        people_count: function (callback) {
            People.countDocuments({}, callback);
        },
        vehicle_count: function (callback) {
            Vehicle.countDocuments({}, callback);
        }
    }, function (err, results) {
        res.render('index', { title: 'Police Report', error: err, data: results });
    });
};

// Display list of all Incidents.
exports.incident_list = function (req, res) {
    Incident.find({}, 'title incident')
        .populate('incident')
        .exec(function (err, list_incidents) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('incident_list', { title: 'Incident List', incident_list: list_incidents });
        });
};

// Display detail page for a specific Incident.
exports.incident_detail = function (req, res, next) {

    async.parallel({
        incident: function (callback) {

            Incident.findById(req.params.id)
                .populate('people')
                .populate('vehicle')
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.incident == null) { // No results.
            var err = new Error('Incident not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('incident_detail', { title: results.incident.title, incident: results.incident });
    });

};

// Display incident create form on GET.
exports.incident_create_get = function (req, res, next) {
    res.render('incident_form', { title: 'Create Incident' });
};

// Handle incident create on POST.
exports.incident_create_post = [

    // Validate and sanitize fields.
    body('formid').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('incidentType').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('addPeople').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('addVehicle').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('occurrenceDate', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('occurrenceTime', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('narrative').trim().isLength({ min: 1 }).escape().withMessage('Narrative must be specified.')
        .isString().withMessage('Narrative has alpha characters.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create incident object with escaped and trimmed data
        var incident = new Incident(
            {
                formid: req.body.formid,
                occurrenceDate: req.body.occurrenceDate,
                occurrenceTime: req.body.occurrenceTime,
                incidentType: req.body.incidentType,
                location: req.body.location,
                locationCommon: req.body.locationCommon,
                addPeople: req.body.addPeople,
                addVehicle: req.body.addVehicle,
                narrative: req.body.narrative,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('incident_form', { title: 'Create Incident', incident: incident, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save incident.
            incident.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new incident record.
                res.redirect(incident.url);
            });
        }
    }
];

// Display incident delete form on GET.
exports.incident_delete_get = function (req, res) {
    async.parallel({
        incident: function (callback) {
            Incident.findById(req.params.id).populate('people').populate('vehicle').exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.incident == null) { // No results.
            res.redirect('/catalog/incident');
        }
        // Successful, so render.
        res.render('incident_delete', { title: 'Delete Incident', incident: results.incident });
    });
};

// Handle incident delete on POST.
exports.incident_delete_post = function (req, res) {
    // Assume the post has valid id (ie no validation/sanitization).

    async.parallel({
        incident: function (callback) {
            Incident.findById(req.body.id).populate('people').populate('vehicle').exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        else {
            // Delete object and redirect to the list of books.
            Incident.findByIdAndRemove(req.body.id, function deleteIncident(err) {
                if (err) { return next(err); }
                // Success - got to incident list.
                res.redirect('/catalog/incident');
            });

        }
    });
};

// Display incident update form on GET.
exports.incident_update_get = function (req, res) {
    // Get incident, people and vehicle for form.
    async.parallel({
        incident: function (callback) {
            Incident.findById(req.params.id).populate('people').populate('vehicle').exec(callback);
        },
        people: function (callback) {
            People.find(callback);
        },
        vehicle: function (callback) {
            Vehicle.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.incident == null) { // No results.
            var err = new Error('Incident not found');
            err.status = 404;
            return next(err);
        }
        res.render('incident_form', { title: 'Update Incident', people: results.people, vehicle: results.vehicle, incident: results.incident });
    });
};

// Handle incident update on POST.
exports.incident_update_post = [

    // Validate and santitize fields.
    body('formid').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('incidentType').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('addPeople').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('addVehicle').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('narrative').trim().isLength({ min: 1 }).escape().withMessage('Narrative must be specified.')
        .isString().withMessage('Narrative has alpha characters.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a incident object with escaped/trimmed data and old id.
        var incident = new Incident(
            {
                formid: req.body.formid,
                occurrenceDate: req.body.occurrenceDate,
                occurrenceTime: req.body.occurrenceTime,
                incidentType: req.body.incidentType,
                location: req.body.location,
                locationCommon: req.body.locationCommon,
                addPeople: req.body.addPeople,
                addVehicle: req.body.addVehicle,
                narrative: req.body.narrative,
                _id: req.params.id // This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all people and vehicle for form
            async.parallel({
                people: function (callback) {
                    People.find(callback);
                },
                vehicle: function (callback) {
                    Vehicle.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }
                res.render('incident_form', { title: 'Update Incident', people: results.people, vehicle: results.vehicle, incident: incident, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Incident.findByIdAndUpdate(req.params.id, incident, {}, function (err, theincident) {
                if (err) { return next(err); }
                // Successful - redirect to incident detail page.
                res.redirect(theincident.url);
            });
        }
    }
];