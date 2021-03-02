var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var PeopleSchema = new Schema(
    {
        p_code: { type: String, required: true, maxlength: 100 },
        first_name: { type: String, required: true, maxlength: 100 },
        middle_intial: { type: String, required: true, maxlength: 1 },
        last_name: { type: String, required: true, maxlength: 100 },
        date_of_birth: { type: Date, required: true },
        date_of_death: { type: Date, required: false },
        origin: { type: String, required: true, maxlength: 100 },
        hair_color: { type: String, required: true, maxlength: 100 },
        race: { type: String, required: true, maxlength: 100 },
        ssn_dl: { type: Number, maxlength: 9 },
        smt: { type: String, required: true },
        address: { type: String, required: true, maxlength: 100 },
        phone_number: { type: String, required: true, maxlength: 100 },
        height: { type: Number, required: true, maxlength: 3 },
        gang_aff: { type: String, maxlength: 100, required: false },
        hazard: { type: String, maxlength: 100, required: false },
        weight: { type: Number, required: true, maxlength: 3 },
        eye_color: { type: String, required: true, maxlength: 3 },
    }
);

// Virtual for Person's URL
PeopleSchema.virtual('url')
    .get(function () {
        return '/catalog/people/' + this._id;
    });

// Virtual for Person's p code
PeopleSchema
    .virtual('prace')
    .get(function () {
        return this.race;
    });

// Virtual for Person's social security number
PeopleSchema
    .virtual('ssn')
    .get(function () {
        return this.ssn_dl;
    });

// Virtual for Person's scars, marks, or tatoos
PeopleSchema
    .virtual('scar')
    .get(function () {
        return this.smt;
    });

// Virtual for Person's address
PeopleSchema
    .virtual('adress')
    .get(function () {
        return this.address;
    });

// Virtual for Person's phone number
PeopleSchema
    .virtual('phone')
    .get(function () {
        return this.phone_number;
    });

// Virtual for Person's gang affiation
PeopleSchema
    .virtual('gang')
    .get(function () {
        return this.gang_aff;
    });

// Virtual for Person's hazard
PeopleSchema
    .virtual('haz')
    .get(function () {
        return this.hazard;
    });

// Virtual for Person's full name
PeopleSchema
    .virtual('name')
    .get(function () {
        return this.first_name + ' ' + this.middle_intial + ' ' + this.last_name;
    });


// Virtual for Person's hair color and eye color
PeopleSchema
    .virtual('face_detail')
    .get(function () {
        return this.hair_color + ' ' + this.eye_color;
    });

// Virtual for Person's weight and height
PeopleSchema
    .virtual('body_detail')
    .get(function () {
        return this.weight + ' ' + this.height;
    });

// Virtual for Person's origin
PeopleSchema
    .virtual('nation')
    .get(function () {
        return this.origin;
    });

//Export model
module.exports = mongoose.model('People', PeopleSchema);