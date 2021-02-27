var Incident = require('../models/incident');
var People = require('../models/people');
var Vehicle = require('../models/vehicle');
var async = require('async');

const { body, validationResult } = require('express-validator');

exports.index = function (req, res) {
    async function countIndex() {
        await function incident_count() {
            Incident.countDocuments({}, callback);
        },
            await function people_count() {
                People.countDocuments({}, callback);
            },
            await function vehicle_count() {
                Vehicle.countDocuments({}, callback);
            },
            function (err, results) {
                res.render('index', { title: 'Police RMS', error: err, data: results });
            };
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

                Book.findById(req.params.id)
                    .populate('people')
                    .populate('vehicle')
                    .exec(callback);
            },
        }, function (err, results) {
            if (err) { return next(err); }
            if (results.book == null) { // No results.
                var err = new Error('Incident not found');
                err.status = 404;
                return next(err);
            }
            // Successful, so render.
            res.render('incident_detail', { title: results.incident.title, incident: results.incident });
        });

    };

    // Display BookInstance create form on GET.
    exports.incident_create_get = function (req, res, next) {
        res.render('incident_form', { title: 'Create Incident' });
    };

    // Handle BookInstance create on POST.
    exports.incident_create_post = [

        // Validate and sanitize fields.
        body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
            .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
        body('middle_intial').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
        body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
            .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
        body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
        body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

        // Process request after validation and sanitization.
        (req, res, next) => {

            // Extract the validation errors from a request.
            const errors = validationResult(req);

            // Create Person object with escaped and trimmed data
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
                    // Successful - redirect to new author record.
                    res.redirect(incident.url);
                });
            }
        }
    ];

    // Display BookInstance delete form on GET.
    exports.incident_delete_get = function (req, res) {
        res.send('NOT IMPLEMENTED: People delete GET');
    };

    // Handle BookInstance delete on POST.
    exports.incident_delete_post = function (req, res) {
        res.send('NOT IMPLEMENTED: People delete POST');
    };

    // Display BookInstance update form on GET.
    exports.incident_update_get = function (req, res) {
        res.send('NOT IMPLEMENTED: People update GET');
    };

    // Handle bookinstance update on POST.
    exports.incident_update_post = function (req, res) {
        res.send('NOT IMPLEMENTED: People update POST');
    };
