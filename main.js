/**
 * @name        PantherBot
 * @version     1.3.2
 * @author      GSUGuide21
 **/
require( "module-alias/register" );

const { Client } = require( "discord.js-commando" );
const initMessages = require( "./messages/base" );
const path = require( "path" );
const fs = require("fs");
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
    
    initMessages( bot );
    
    console.log( bot );
} );

bot.login( PANTHERBOT_TOKEN );