var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var VehicleSchema = new Schema({
    plate_number: { type: String, required: true, maxlength: 7 },
    vehicle_color: { type: String, required: true, maxlength: 3 },
    vehicle_year: { type: Number, required: true, maxlength: 4 },
    vehicle_make: { type: String, required: true, minlength: 1 },
    vehicle_model: { type: String, required: true },
    vehicle_body_type: { type: String, maxlength: 2 },
    vehicle_details: { type: String, required: true},
    vehicle_vin: { type: Number, maxlength: 17 },
    vehicle_registration: { type: String, required: true,},
});


VehicleSchema.virtual('url').get(function () {
    return '/catalog/vehicle/' + this._id;
});

//Virtuals that holds plate number
VehicleSchema
    .virtual('platenumber')
    .get(function () {
        return this.plate_number;
    });
//Virtuals that holds vehicle color
VehicleSchema
    .virtual('vehiclec')
    .get(function () {
        return this.vehicle_color;
    });
//Virtuals that holds vehicle year
VehicleSchema
    .virtual('vehicley')
    .get(function () {
        return this.vehicle_year;
    });
//Virtuals that holds vehicle make
VehicleSchema
    .virtual('make')
    .get(function () {
        return this.vehicle_make;
    });
//Virtuals that holds vehicle model
VehicleSchema
    .virtual('model')
    .get(function () {
        return this.vehicle_model;
    });
//Virtuals that holds vehicle body type
VehicleSchema
    .virtual('bodyt')
    .get(function () {
        return this.vehicle_body_type;
    });
//Virtuals that holds vehicle details
VehicleSchema
    .virtual('vehicled')
    .get(function () {
        return this.vehicle_details;
    });
//Virtuals that holds vehicle vin number
VehicleSchema
    .virtual('vin')
    .get(function () {
        return this.vehicle_vin;
    });
//Virtuals that holds vehicle registration
VehicleSchema
    .virtual('registration')
    .get(function () {
        return this.vehicle_registration;
    });


//Virtual that holds vehicles make, model, and year
VehicleSchema
    .virtual('summary')
    .get(function () {
        return this.vehicle_make + '' + this.vehicle_model + '' + this.vehicle_year;
    });

module.exports = mongoose.model('Vehicle', VehicleSchema);