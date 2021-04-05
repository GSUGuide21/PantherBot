const initMessages = require( "@features/messages/base" );
const initFilter = require( "@features/filter/base" );
const { Client } = require( "discord.js-commando" );

/**
 * Initializes PantherBot's features
 * @param {Client} bot 
 */
module.exports = bot => { 
    initMessages( bot );
    initFilter( bot );
};