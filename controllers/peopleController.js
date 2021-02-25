var Person = require('../models/people');




exports.index = function (req, res) {
    res.render('index', {title: 'Police Report'});

};