var Incident = require('../models/incident');




// Display list of all Incidents.
exports.incident_list = function(req, res) {
    Incident.find({}, 'title incident')
        .populate('incident')
        .exec(function (err, list_incidents) {
            if (err) { return next(err); }
            //Successful, so render
            res.render('incident_list', { title: 'Incident List', incident_list: list_incidents });
        });
};

// Display detail page for a specific BookInstance.
exports.incident_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: People detail: ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.incident_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: People create GET');
};

// Handle BookInstance create on POST.
exports.incident_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: People create POST');
};

// Display BookInstance delete form on GET.
exports.incident_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: People delete GET');
};

// Handle BookInstance delete on POST.
exports.incident_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: People delete POST');
};

// Display BookInstance update form on GET.
exports.incident_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: People update GET');
};

// Handle bookinstance update on POST.
exports.incident_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: People update POST');
};
