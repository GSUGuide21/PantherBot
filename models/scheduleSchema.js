const mongoose = require( "mongoose" );

const reqString = { 
    type : String,
    required : true
};

const schema = new mongoose.Schema( { 
    eventDate : reqString,
    eventTime : reqString,
    eventTitle : reqString,
    eventLocation : { type : String },
    guildId : reqString,
    channelId : reqString
} );

const name = "pantherbot-schedule";

module.exports = mongoose.model[ name ] || mongoose.model( name, schema, name );