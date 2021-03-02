var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var PeopleSchema = new Schema(
    {
        // p_code: { type: String, required: true, maxlength: 100 },
        first_name: { type: String, required: true, maxlength: 100 },
        middle_intial: { type: String, required: true, maxlength: 1 },
        last_name: { type: String, required: true, maxlength: 100 },
        date_of_birth: { type: Date, required: true },
        date_of_death: { type: Date, required: false },
        origin: { type: String, required: true, maxlength: 100 },
        hair_color: { type: String, required: true, maxlength: 100 },
        // race: { type: String, required: true, maxlength: 100 },
        // ssn_dl: { type: Number, maxlength: 9 },
        // smt: { type: String, required: true },
        // address: { type: String, required: true, maxlength: 100 },
        // phone_number: { type: String, required: true, maxlength: 100 },
        height: { type: Number, required: true, maxlength: 3 },
        // gang_aff: { type: String, maxlength: 100, required: false },
        // hazard: { type: String, maxlength: 100, required: false },
        weight: { type: Number, required: true, maxlength: 3 },
        eye_color: { type: String, required: true, maxlength: 3 },
    }
);

// Virtual for author's URL
PeopleSchema.virtual('url')
    .get(function () {
        return '/catalog/people/' + this._id;
    });

// Virtual for author's full name
PeopleSchema
    .virtual('name')
    .get(function () {
        return this.first_name + ' ' + this.middle_intial + ' ' + this.last_name;
    });


// Virtual for person's hair color and eye color
PeopleSchema
    .virtual('face_detail')
    .get(function () {
        return this.hair_color + ' ' + this.eye_color;
    });

// Virtual for person's weight and height
PeopleSchema
    .virtual('body_detail')
    .get(function () {
        return this.weight + ' ' + this.height;
    });

// Virtual for person's origin
PeopleSchema
    .virtual('nation')
    .get(function () {
        return this.origin;
    });

//Export model
module.exports = mongoose.model('People', PeopleSchema);