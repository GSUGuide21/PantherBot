/**
 * @name        PantherBot
 * @version     1.1.2
 * @author      GSUGuide21
 **/

const { Client } = require( "discord.js-commando" );
const path = require( "path" );
const __dirname = require( "./dirname.js" );

const { PANTHERBOT_TOKEN } = process.env;

const bot = new Client( { 
    owner : "707779366318243840",
    commandPrefix : "$"
} );

console.log( PANTHERBOT_TOKEN, bot );

bot.on( "ready", async ( ) => { 
    console.log( "PantherBot has been initialized!" );

    bot.registry
        .registerGroups( [ 
            [ "main", "" ],
            [ "mod", "" ],
            [ "poll", "" ],
            [ "misc", "" ]
        ] )
        .registerDefaults( )
        .registerCommandsIn( path.join( __dirname, "cmds" ) );
} );

bot.login( PANTHERBOT_TOKEN );

/*import Discord from "discord.js";
import { CommandoClient } from "discord.js-commando";
import path from "path";
import fs from "fs-extra";
import __dirname from "./dirname.js";
import welcome from "./welcome/init.js";

const bot = new Discord.Client( );

const { PANTHERBOT_TOKEN : token } = process.env;

bot.once( "ready", async ( ) => { 
    console.log( "PantherBot has been initialized!" );

    const base = "base.js";

    const { "default" : commandBase } = await import( `./commands/${base}` );

    console.log( `./commands/${base}`, commandBase );

    const commands = [ ];

    const readCmds = async dir => {
        const files = fs.readdirSync( path.join( __dirname, dir ) );

        for ( const file of files ) {
            const stat = fs.lstatSync( path.join( __dirname, dir, file ) );

            if ( stat.isDirectory( ) ) {
                readCmds( path.join( dir, file ) );
            } else if ( file !== base ) {
                const { "default" : option } = await import( path.join( __dirname, dir, file ) );
                console.log( file, option );

                commands.push( { file, option } );
            }
        }
    };

    const registerCmds = async ( dir, msg ) => { 
        await readCmds( dir );

        for ( const commandEntry of commands ) {
            const [ file, command ] = commandEntry;

            console.log( `Registering command: ${file}!` );

            commandBase( bot, msg, command );
        }
    };

    bot.on( "message", msg => {
        registerCmds( "commands", msg );
    } );
} );

bot.once( "ready", async ( ) => { 
    console.log( "PantherBot has been initialized!" );

    const base = "base.js";

    const { "default" : commandBase } = await import( `./commands/${base}` );

    console.log( `./commands/${base}`, commandBase );

    async function readCmds( dir ) { 
        const files = fs.readdirSync( path.join( __dirname, dir ) );

        for ( const file of files ) {
            const stat = fs.lstatSync( path.join( __dirname, dir, file ) );

            if ( stat.isDirectory( ) ) {
                readCmds( path.join( dir, file ) );
            } else if ( file !== base ) {
                const { "default" : option } = await import( path.join( __dirname, dir, file ) );
                console.log( file, option );
                commandBase( bot, option );
            }
        }
    }

    readCmds( "commands" );

    welcome( bot );
} );

bot.login( token );*/