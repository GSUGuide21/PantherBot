const mongoose = require( "mongoose" );

const reqString = { 
    type : String,
    required : true
};

module.exports = new mongoose.Schema( { 
    date : { 
        type : Date,
        required : true
    },
    eventTitle : reqString,
    eventLocation : reqString,
    guildId : reqString,
    channelId : reqString
} );