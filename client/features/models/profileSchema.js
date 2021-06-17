const mongoose = require( "mongoose" );

const reqString = { 
	type: String,
	required: true
};

const profileSchema = new mongoose.Schema( { 
	userId: { ...reqString, unique: true },
	guildId: reqString,
	balance: { type: Number, default: 0 },
	bank: { type: Number },
	warnings: { type: Number, default: 0 },
	muted: { type: Boolean, default: false },
	muteExpiry: { type: Date },
	banExpiry: { type: Date }
} );

const name = "profile-models";

module.exports = mongoose.model( name, profileSchema, name );