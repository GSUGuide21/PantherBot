/**
 * @name		PantherBot
 * @version		3.0.1
 * @author		GSUGuide21
 */
require( "module-alias/register" );

const PantherBotClient = require( "./client" );
const bot = new PantherBotClient( );
bot.init( );