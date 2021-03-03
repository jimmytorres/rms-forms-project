var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    plate_number: { type: String, required: true, maxlength:7},
    vehicle_color: { type: String, required: true, maxlength:3},
    vehicle_year: { type: Number, required: true, maxlength:4},
    vehicle_make: { type: String, required: true, minlength:1},
    vehicle_model: { type: String, required: true},
    vehicle_body_type: { type: String, maxlength: 2},
    vehicle_details: { type: String, required: true},
    vehicle_vin: { type: Number, maxlength:17},
    vehicle_registration: { type: String, required:true},
});


VehicleSchema.virtual('url').get(function () {
    return '/catalog/vehicle/' + this._id;
});

VehicleSchema
    .virtual('summary')
    .get(function () {
        return this.vehicle_make + '' + this.vehicle_model + '' + this.vehicle_year;
    });

module.exports = mongoose.model('Vehicle', VehicleSchema);