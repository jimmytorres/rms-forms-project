var People = require('../models/people');
var async = require('async');
var Vehicle = require('../models/vehicle')

const { body, validationResult } = require('express-validator');

// Display list of all Authors.
exports.people_list = function (req, res, next) {

    People.find()
        .sort([['name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('people_list', { title: 'People List', people_list: list_people });
        });

};

// Display detail page for a specific Author.
exports.people_detail = function (req, res, next) {

    async.parallel({
        people: function (callback) {
            People.findById(req.params.id)
                .exec(callback)
        },
        people_vehicle: function (callback) {
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
        res.render('people_detail', { title: 'People Detail', people: results.poeple, people_vehicle: results.people_vehicle });
    });

};

// Display Author create form on GET.
exports.people_create_get = function (req, res, next) {
    res.render('people_form', { title: 'Create Person' });
};

// Handle Author create on POST.
exports.people_create_post = [

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
        var people = new People(
            {
                p_code: { type: String, required: true, maxlength: 100 },
                first_name: { type: String, required: true, maxlength: 100 },
                middle_intial: { type: String, required: true, maxlength: 1 },
                last_name: { type: String, required: true, maxlength: 100 },
                date_of_birth: { type: Date, required: true },
                date_of_death: { type: Date },
                origin: { type: String, required: true, maxlength: 100 },
                hair_color: { type: String, required: true, maxlength: 100 },
                race: { type: String, required: true, maxlength: 100 },
                ssn_dl: { type: Number, maxlength: 9 },
                smt: { type: String },
                address: { type: String, required: true, maxlength: 100 },
                phone_number: { type: String, required: true, maxlength: 100 },
                height: { type: Number, required: true, maxlength: 3 },
                gang_aff: { type: String, maxlength: 100 },
                hazard: { type: String, maxlength: 100 },
                weight: { type: Number, required: true, maxlength: 3 },
                eye_color: { type: String, required: true, maxlength: 3 },
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('people_form', { title: 'Create Person', people: people, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save author.
            people.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(people.url);
            });
        }
    }
];


// Display Author delete form on GET.
exports.people_delete_get = function (req, res, next) {

    async.parallel({
        people: function (callback) {
            People.findById(req.params.id).exec(callback)
        },
        people_vehicle: function (callback) {
            Vehicle.find({ 'author': req.params.id }).exec(callback)
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

// Handle Author delete on POST.
exports.people_delete_post = function (req, res, next) {

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
        if (results.poeple_books.length > 0) {
            // Author has books. Render in same way as for GET route.
            res.render('poeple_delete', { title: 'Delete Person', people: results.people, people_vehicle: results.people_vehicle });
            return;
        }
        else {
            // Author has no books. Delete object and redirect to the list of authors.
            People.findByIdAndRemove(req.body.peopleid, function deletePeople(err) {
                if (err) { return next(err); }
                // Success - go to author list.
                res.redirect('/catalog/people')
            })

        }
    });

};

// Display Author update form on GET.
exports.people_update_get = function (req, res, next) {

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


// Handle Author update on POST.
exports.people_update_post = [

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
        var people = new People(
            {
                p_code: { required: true },
                first_name: { type: String, required: true, maxlength: 100 },
                middle_intial: { type: String, required: true, maxlength: 1 },
                last_name: { type: String, required: true, maxlength: 100 },
                date_of_birth: { type: Date, required: true },
                origin: { required: true },
                hair_color: { required: true },
                race: { required: true },
                ssn_dl: { type: Number, maxlength: 9 },
                smt: { type: String, required: true },
                address: { type: address, required: true },
                phone_number: { type: phone_number, required: true },
                height: { type: Number, required: true, maxlength: 3 },
                gang_aff: { required: true },
                hazard: { required: true },
                weight: { type: Number, required: true, maxlength: 3 },
                eye_color: { type: String, required: true, maxlength: 3 },
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('people_form', { title: 'Update Person', people: people, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            People.findByIdAndUpdate(req.params.id, people, {}, function (err, thepeople) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(thepeople.url);
            });
        }
    }
];