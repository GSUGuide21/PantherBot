const mongoose = require( "mongoose" );

const reqString = { 
    type : String,
    required : true
};

const schema = new mongoose.Schema( { 
    eventDate : { type : Date, required : true },
    eventDay : reqString,
    eventTime : reqString,
    eventTitle : reqString,
    eventLocation : { type : String },
    eventDescription : { type : String },
    eventImage : { type : String },
    guildId : reqString,
    channelId : reqString
} );

const name = "pantherbot-schedule";

module.exports = mongoose.model[ name ] || mongoose.model( name, schema, name );