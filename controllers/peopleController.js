var Person = require('../models/people');




exports.index = function (req, res) {
    res.render('index', {title: 'Police Report'});

};

// Display list of all People.
exports.people_list = function(req, res) {
    Person.find({}, 'title people')
        .populate('people')
        .exec(function (err, list_peoples) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('people_list', { title: 'People List', people_list: list_peoples });
        });
};

// Display detail page for a specific BookInstance.
exports.people_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: People detail: ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.people_create_get = function(req, res, next) {
    res.render('people_form', { title: 'Create Person' });
};

// Handle BookInstance create on POST.
exports.people_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: People create POST');
};

// Display BookInstance delete form on GET.
exports.people_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: People delete GET');
};

// Handle BookInstance delete on POST.
exports.people_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: People delete POST');
};

// Display BookInstance update form on GET.
exports.people_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: People update GET');
};

// Handle bookinstance update on POST.
exports.people_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: People update POST');
};
