var People = require('../models/people');
var async = require('async');
var Vehicle = require('../models/vehicle');

const { body, validationResult } = require('express-validator');

// Display list of all People.
exports.people_list = function (req, res) {
    People.find({}, 'title people')
        .populate('people')
        .exec(function (err, list_peoples) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('people_list', { title: 'People List', people_list: list_peoples });
        });
};

// Display detail page for a specific Person.
exports.people_detail = function (req, res, next) {

    async.parallel({
        people: function (callback) {
            People.findById(req.params.id)
                .exec(callback)
        },
        peoples_vehicles: function (callback) {
            Vehicle.find({ 'people': req.params.id }, 'title summary')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.people == null) { // No results.
            var err = new Error('Person not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('people_detail', { title: 'Person Detail', people: results.people, people_vehicls: results.peoples_vehicles });
    });

};


// Display People create form on GET.
exports.people_create_get = function (req, res, next) {
    res.render('people_form', { title: 'Create Person' });
};

// Handle People create on POST.
exports.people_create_post = [

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
        var person = new Person(
            {
                p_code: req.body.pcode,
                first_name: req.body.first_name,
                middle_intial: req.body.middle_intial,
                last_name: req.body.last_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                origin: req.body.origin,
                hair_color: req.body.hair_color,
                race: req.body.race,
                ssn_dl: req.body.ssn_dl,
                smt: req.body.smt,
                address: req.body.address,
                phone_number: req.body.phone_number,
                height: req.body.height,
                gang_aff: req.body.gang_aff,
                hazard: req.body.hazard,
                weight: req.body.weight,
                eye_color: req.body.eye_color,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('people_form', { title: 'Create Person', person: person, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save person.
            person.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(person.url);
            });
        }
    }
];

// Display People delete form on GET.
exports.people_delete_get = function (req, res) {
    res.send('NOT IMPLEMENTED: People delete GET');
};

// Handle People delete on POST.
exports.people_delete_post = function (req, res) {
    res.send('NOT IMPLEMENTED: People delete POST');
};

// Display People update form on GET.
exports.people_update_get = function (req, res) {
    res.send('NOT IMPLEMENTED: People update GET');
};

// Handle People update on POST.
exports.people_update_post = function (req, res) {
    res.send('NOT IMPLEMENTED: People update POST');
};
