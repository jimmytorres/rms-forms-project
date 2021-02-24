var mongoose = require('mongoose');
const { DateTime } = require("luxon");  //for date handling

var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    plate_number: { type: String, required: true, maxlength:7},
    vehicle_color: { type: String, required: true, maxlength:3},
    vehicle_year: { type: Number, required: true, maxlength:4},
    vehicle_make: { type: String, required: true, minlength:3},
    vehicle_model: { type: String, required: true},
    vehicle_body_type: { type: String, maxlength: 2},
    vehicle_details: { type: String},
    vehicle_vin: { type: Number, maxlength:17},
    vehicle_registration: { type: String}
});

// Virtual for author "full" name.
VehicleSchema.virtual('vehicle').get(function () {
    return this.vehicle_body_type + ', ' + this.vehicle_year + ', ' + this.vehicle_model + ', ' + this.vehicle_make;
});

// Virtual for this author instance URL.

 VehicleSchema.virtual('url').get(function () {
     return '/catalog/vehicle/' + this._id;
 });

// Export model.
module.exports = mongoose.model('Vehicle', VehicleSchema);