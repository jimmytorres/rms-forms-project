var Incident = require('../models/incident');
var async = require('async');
var People = require('../models/people')
var Vehicle = require('../models/vehicle')

const { body, validationResult } = require('express-validator');

exports.index = function (req, res) {
    res.render('index', { title: 'Police Report' });
};

// Display list of all Authors.
exports.people_list = function (req, res, next) {

    Incident.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_incidents) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('incidents_list', { title: 'Incidents List', incidents_list: list_incidents });
        });

};

// Display detail page for a specific Person.
exports.incident_detail = function (req, res, next) {

    async.parallel({
        incident: function (callback) {
            Incident.findById(req.params.id)
                .exec(callback)
        },
        people: function (callback) {
            People.findById(req.params.id)
                .exec(callback)
        },
        vehicles_peoples: function (callback) {
            Vehicle.find({ 'people': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.incident == null) { // No results.
            var err = new Error('Incident not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('incident_detail', { title: 'Incident Detail', incident: results.incident, people: results.people, vehicles_peoples: results.vehicles_peoples });
    });

};

// Display Author create form on GET.
exports.incident_create_get = function (req, res, next) {
    res.render('incident_form', { title: 'Create Incident' });
};

// Handle Author create on POST.
exports.incident_create_post = [

    // Validate and sanitize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('middle_intial').trim().isLength({ max: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Middle Intial name has non-alphanumeric characters.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data
        var incident = new Incident(
            {
                formId: { type: String, required: true },
                ocurenceDate: { type: Date, required: true },
                ocurenceTime: { type: String, required: true, minlength: 0, maxlength: 24 },
                incidentType: { type: String, required: true },
                location: { type: String, required: true },
                locationCommon: { type: String, required: true },
                addPeople: { type: String, required: true },
                addVehicle: { type: String },
                narrative: [{ type: String, required: true }]
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('incident_form', { title: 'Create Incident', incident: incident, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            incident.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(incident.url);
            });
        }
    }
];


// Display Author delete form on GET.
exports.incident_delete_get = function (req, res, next) {

    async.parallel({
        incident: function (callback) {
            Incident.findById(req.params.id).exec(callback)
        },
        people: function (callback) {
            People.findById(req.params.id).exec(callback)
        },
        vehicles_peoples: function (callback) {
            Vehicle.find({ 'people': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.incident == null) { // No results.
            res.redirect('/catalog/incident');
        }
        // Successful, so render.
        res.render('incident_delete', { title: 'Delete Incident', incident: results.incident, people: results.people, vehicles_peoples: results.vehicles_peoples });
    });

};

// Handle Author delete on POST.
exports.incident_delete_post = function (req, res, next) {

    async.parallel({
        incident: function (callback) {
            Incident.findById(req.body.incidentid).exec(callback)
        },
        people: function (callback) {
            People.findById(req.body.peopleid).exec(callback)
        },
        vehicles_peoples: function (callback) {
            Vehicle.find({ 'people': req.body.peopleid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.poeple_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('incident_delete', { title: 'Delete Incident', incident: results.incident, people: results.people, vehicles_peoples: results.vehicles_peoples });
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            People.findByIdAndRemove(req.body.incidentid, function deleteIncident(err) {
                if (err) { return next(err); }
                // Success - go to people list.
                res.redirect('/catalog/incident')
            })

        }
    });

};

// Display Author update form on GET.
exports.incident_update_get = function (req, res, next) {

    Incident.findById(req.params.id, function (err, incident) {
        if (err) { return next(err); }
        if (people == null) { // No results.
            var err = new Error('Incident not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('incident_form', { title: 'Update Incident', incident: incident });

    });
};


// Handle Author update on POST.
exports.incident_update_post = [

    // Validate and santize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('middle_intial').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.')
        .isAlphanumeric().withMessage('Middle Intial has non-alphanumeric characters.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Author object with escaped and trimmed data (and the old id!)
        var incident = new Incident(
            {
                formId: { type: String, required: true },
                ocurenceDate: { type: Date, required: true },
                ocurenceTime: { type: String, required: true, minlength: 0, maxlength: 24 },
                incidentType: { type: String, required: true },
                location: { type: String, required: true },
                locationCommon: { type: String, required: true },
                addPeople: { type: String, required: true },
                addVehicle: { type: String },
                narrative: [{ type: String, required: true }]
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('incident_form', { title: 'Update Incident', incident: incident, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Incident.findByIdAndUpdate(req.params.id, incident, {}, function (err, theincident) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theincident.url);
            });
        }
    }
];