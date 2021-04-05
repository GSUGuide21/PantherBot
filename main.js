/**
 * @name        PantherBot
 * @version     1.3.2
 * @author      GSUGuide21
 **/
require( "module-alias/register" );

const { Client } = require( "discord.js-commando" );
const initFeatures = require( "@features/init" );
const path = require( "path" );
const mongoose = require( "mongoose" );

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
            [ "miscellaneous", "Miscellaneous" ],
            [ "schedule", "Schedule" ]
        ] )
        .registerDefaults( )
        .registerCommandsIn( path.join( __dirname, "cmds" ) );
    
    console.log( bot );

    mongoose.connect( process.env.MONGO_URI, { 
        useNewUrlParser : true,
        useUnifiedTopology : true
    } );
} );

initFeatures( bot );

bot.login( PANTHERBOT_TOKEN );