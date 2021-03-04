var People = require('../models/people');
var Vehicle = require('../models/vehicle');
var async = require('async');

const { body, validationResult } = require('express-validator');

// Display list of all People.
exports.people_list = function (req, res) {
    People.find()
        .sort([['last_name', 'ascending']])
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
        res.render('people_detail', { title: 'Person Detail', people: results.people, people_vehicles: results.peoples_vehicles });
    });

};


// Display People create form on GET.
exports.people_create_get = function (req, res, next) {
    res.render('people_form', { title: 'Create Person' });
};

// Handle People create on POST.
exports.people_create_post = [

    // Validate and sanitize fields.
    body('p_code').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('P code has non-alphanumeric characters.'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('middle_intial').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
        .isAlphanumeric().withMessage('Middle intial has non-alphanumeric characters.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('origin').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('hair_color').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('race').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('ssn').trim().isLength({ max: 9 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Social security has numeric characters.'),
    body('dl', 'Invalid expiration date for drivers license').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('smt').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('address').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('phone_number').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('height').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isNumeric().withMessage('Height has numeric characters.'),
    body('gang_aff').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('hazard').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('weight').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isNumeric().withMessage('Weight has numeric characters.'),
    body('eye_color').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Person object with escaped and trimmed data
        var people = new People(
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
                ssn: req.body.ssn,
                dl: req.body.dl,
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
            res.render('people_form', { title: 'Create Person', people: people, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save Person.
            people.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new Person record.
                res.redirect(people.url);
            });
        }
    }
];

// Display People delete form on GET.
exports.people_delete_get = function (req, res) {
    async.parallel({
        people: function (callback) {
            People.findById(req.params.id).exec(callback)
        },
        people_vehicle: function (callback) {
            Vehicle.find({ 'people': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.people == null) { // No results.
            res.redirect('/catalog/people');
        }
        // Successful, so render.
        res.render('people_delete', { title: 'Delete Person', people: results.people, people_vehicle: results.people_vehicle });
    });
};

// Handle People delete on POST.
exports.people_delete_post = function (req, res) {
    async.parallel({
        people: function (callback) {
            People.findById(req.body.peopleid).exec(callback)
        },
        people_vehicle: function (callback) {
            Vehicle.find({ 'people': req.body.peopleid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.people_vehicle.length > 0) {
            // Person has vehicle. Render in same way as for GET route.
            res.render('people_delete', { title: 'Delete Person', people: results.people, people_vehicle: results.people_vehicle });
            return;
        }
        else {
            // Person has no vehicle. Delete object and redirect to the list of People.
            People.findByIdAndRemove(req.body.peopleid, function deletePeople(err) {
                if (err) { return next(err); }
                // Success - go to author list.
                res.redirect('/catalog/people')
            })

        }
    });
};

// Display People update form on GET.
exports.people_update_get = function (req, res) {
    People.findById(req.params.id, function (err, people) {
        if (err) { return next(err); }
        if (people == null) { // No results.
            var err = new Error('Person not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('people_form', { title: 'Update Person', people: people });

    });
};

// Handle People update on POST.
exports.people_update_post = [
    // Validate and santize fields.
    body('p_code').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('P code has non-alphanumeric characters.'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('middle_intial').trim().isLength({ max: 1 }).escape().withMessage('Middle intial must be specified.')
        .isAlphanumeric().withMessage('Middle intial has non-alphanumeric characters.'),
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('origin').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('hair_color').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('race').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('ssn').trim().isLength({ max: 9 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Social security has numeric characters.'),
    body('dl', 'Invalid expiration date for drivers license').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('smt').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('address').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('phone_number').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('height').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isNumeric().withMessage('Height has numeric characters.'),
    body('gang_aff').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('hazard').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('weight').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isNumeric().withMessage('Weight has numeric characters.'),
    body('eye_color').trim().isLength({ max: 3 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create People object with escaped and trimmed data (and the old id!)
        var people = new People(
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
                ssn: req.body.ssn,
                dl: req.body.dl,
                smt: req.body.smt,
                address: req.body.address,
                phone_number: req.body.phone_number,
                height: req.body.height,
                gang_aff: req.body.gang_aff,
                hazard: req.body.hazard,
                weight: req.body.weight,
                eye_color: req.body.eye_color,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('people_form', { title: 'Update People', people: people, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            People.findByIdAndUpdate(req.params.id, people, {}, function (err, thepeople) {
                if (err) { return next(err); }
                // Successful - redirect to People detail page.
                res.redirect(thepeople.url);
            });
        }
    }
];
