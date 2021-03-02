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

// Virtual for Incident's form id
IncidentSchema
    .virtual('incident_id')
    .get(function () {
        return this.formid;
    });

// Virtual for Incident's occurrence date
IncidentSchema
    .virtual('oc_date')
    .get(function () {
        return this.occurrenceDate;
    });

// Virtual for Incident's occurence time
IncidentSchema
    .virtual('oc_time')
    .get(function () {
        return this.occurrenceTime;
    });

// Virtual for Incident's type
IncidentSchema
    .virtual('incident_type')
    .get(function () {
        return this.incidentType;
    });

// Virtual for Incident's location
IncidentSchema
    .virtual('local')
    .get(function () {
        return this.location;
    });

// Virtual for Incident's common location
IncidentSchema
    .virtual('c_local')
    .get(function () {
        return this.locationCommon;
    });

// Virtual for Incident's people
IncidentSchema
    .virtual('add_p')
    .get(function () {
        return this.addPeople;
    });

// Virtual for Incident's vehicles
IncidentSchema
    .virtual('add_v')
    .get(function () {
        return this.addVehicle;
    });

// Virtual for Incident's narrative
IncidentSchema
    .virtual('narr')
    .get(function () {
        return '/catalog/incident/' + this.narrative;
    });

// Virtual for Incident's url
IncidentSchema
    .virtual('url')
    .get(function () {
        return '/catalog/incident/' + this._id;
    });

//Export model
module.exports = mongoose.model('Incident', IncidentSchema);