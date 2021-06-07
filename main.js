/**
 * @name		PantherBot
 * @version		2.0.0
 * @author		GSUGuide21
 */
require( "module-alias/register" );

const PantherBotClient = require( "./client" );

const bot = new PantherBotClient( );

bot.initFeatures( );

bot.init( );