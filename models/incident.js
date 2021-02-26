var mongoose = require('mongoose');
const { DateTime } = require("luxon");

var Schema = mongoose.Schema;

var IncidentSchema = new Schema(
    {
        formid: { type: String, required: true },
        occurrenceDate: { type: String, required: true },
        occurrenceTime: { type: String, required: true },
        incidentType: { type: String, required: true },
        location: { type: String, required: true },
        locationCommon: { type: String, required: true },
        addPeople: { type: String, required: true },
        addVehicle: { type: String, required: true },
        narrative: { type: String, required: true },
    }
);

IncidentSchema
    .virtual('incident_id')
    .get(function () {
        return '/catalog/incident/' + this.formid;
    });

IncidentSchema
    .virtual('url')
    .get(function () {
        return '/catalog/incident/' + this._id;
    });

//Export model
module.exports = mongoose.model('Incident', IncidentSchema);