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
     return '/home/vehicle/' + this._id;
 });

// VehicleSchema.virtual('lifespan').get(function () {
//     var lifetime_string = '';
//     if (this.date_of_birth) {
//         lifetime_string = DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED);
//     }
//     lifetime_string += ' - ';
//     if (this.date_of_death) {
//         lifetime_string += DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED)
//     }
//     return lifetime_string;
// });

// AuthorSchema.virtual('date_of_birth_yyyy_mm_dd').get(function () {
//     return DateTime.fromJSDate(this.date_of_birth).toISODate(); //format 'YYYY-MM-DD'
// });

// AuthorSchema.virtual('date_of_death_yyyy_mm_dd').get(function () {
//     return DateTime.fromJSDate(this.date_of_death).toISODate(); //format 'YYYY-MM-DD'
// });

// Export model.
module.exports = mongoose.model('Vehicle', VehicleSchema);