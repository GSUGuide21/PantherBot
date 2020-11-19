/**
 * @name        PantherBot
 * @version     1.1.2
 * @author      GSUGuide21
 **/

import Discord from "discord.js";
import path from "path";
import fs from "fs-extra";
import __dirname from "./util/dirname.js";

const bot = new Discord.Client( );

const { PANTHERBOT_TOKEN : token } = process.env;

bot.once( "ready", async ( ) => { 
    console.log( "PantherBot has been initialized!" );

    const base = "base.js";

    const commandBase = await import( `./commands/${base}` );

    function readCmds( dir ) { 
        const files = fs.readdirSync( path.join( __dirname, dir ) );

        for ( const file of files ) {
            const stat = fs.lstatSync( path.join( __dirname, dir, file ) );

            if ( stat.isDirectory( ) ) {
                readCmds( path.join( dir, file ) );
            } else if ( file !== base ) {
                const option = await import( path.join( __dirname, dir, file ) );
                console.log( file, option );
                commandBase( bot, option );
            }
        }
    }

    readCmds( "commands" );
} );

bot.login( token );