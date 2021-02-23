var mongoose = require('mongoose');
const {DateTime} = require("luxon");

var Schema = mongoose.Schema;

var IncidentSchema = new Schema(
    {
        formId: { type: String, required: true },
        ocurenceDate: {type: Date, required: true},
        ocurenceTime: {type: String, required: true, minlength: 0, maxlength: 24},
        incidentType: {type: String, required: true},
        location: {type: String, required: true},
        locationCommon: {type: String, required: true},
        addPeople: {type: String, required: true},
        addVehicle: {type: String},
        narrative: [{type: String, required: true}]
    }
);

// Virtual for book's URL
IncidentSchema
    .virtual('url')
    .get(function () {
        return '/catalog/incident/' + this._id;
    });

//generate form id
IncidentSchema.virtual('url').get(function(){
    return String + this._id;
})
//Date
IncidentSchema.virtual('dateCreated').get(function (){
    var date_string = '';
    if (this.ocurenceDate){
        date_string = DateTime.fromJSDate(this.ocurenceDate).toLocaleString(DateTime.DATE_MED);
    }
    return date_string;
});
//time

//Incident type

//location

//common name for that location

//add people

//add vehicle

//narrative

//Export model
module.exports = mongoose.model('Book', BookSchema);