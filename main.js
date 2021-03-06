/**
 * @name        PantherBot
 * @version     1.1.2
 * @author      GSUGuide21
 **/
require( "module-alias/register" );

const { Client } = require( "discord.js-commando" );
const messages = require( "./messages" );
const path = require( "path" );
// const __dirname = require( "./dirname.js" );

const { PANTHERBOT_TOKEN } = process.env;

const bot = new Client( { 
    owner : "707779366318243840",
    commandPrefix : "$"
} );

bot.active = true;

bot.once( "ready", async ( ) => { 
    console.log( "PantherBot has been initialized!" );

    bot.registry
        .registerGroups( [ 
            [ "main", "Main" ],
            [ "moderation", "Moderation" ],
            [ "integration", "Integration" ],
            [ "poll", "Poll" ],
            [ "games", "Games" ],
            [ "music", "Music" ],
            [ "miscellaneous", "Miscellaneous" ]
        ] )
        .registerDefaults( )
        .registerCommandsIn( path.join( __dirname, "cmds" ) );
    
    bot.on( "guildMemberAdd", async ( member ) => { 
        messages.welcome( member, bot );
    } );
    
    console.log( bot );
} );

bot.login( PANTHERBOT_TOKEN );