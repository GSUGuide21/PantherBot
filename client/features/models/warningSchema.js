const mongoose = require( "mongoose" );

const reqString = { 
    type : String,
    required : true
};

const schema = new mongoose.Schema( { 
    guildId : reqString,
    memberId : reqString,
    warnings : { 
        type : Number,
        required : true
    }
} );

const name = "pantherbot-warnings";

module.exports = mongoose.model[ name ] || mongoose.model( name, schema, name );