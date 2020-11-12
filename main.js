/**
 * @name        PantherBot
 * @version     1.0.1
 * @author      GSUGuide21
 **/
// New script
// Discord.js
import Discord from "discord.js";
// Dotenv
import dotenv from "dotenv";
// FS
import fs from "fs-extra";
// Path
import path from "path";
// __dirname
import __dirname from "./src/dirname";
// Responses object
import responses from "./src/responses";
// Messages object
import messages from "./src/messages";
// Questions object
import questions from "./src/questions";

// Configuring environment variables
dotenv.config( );
// Sending a console log message
console.log( "Initializing PantherBot!" );

// Creating a client for PantherBot
const { Client } = Discord;
const bot = new Client( );

// PantherBot's token
const { PANTHERBOT_TOKEN : token } = process.env;

// PantherBot's command prefix
const CMD_PREFIX = "$";

// Fetching messages
const { join, leave, kick, ban } = messages;

// Creating a list of bot commands
bot.commands = new Discord.Collection( );

// Creating a list of command aliases
bot.aliases = new Discord.Collection( );

// Creating a list of categories
bot.categories = fs.readdirSync( "./commands/" );

/**
 * Finding nested commands
 * @param {string} dir
 * @param {string} pattern
 * @returns {string[]}
 **/
function findNested( dir, pattern ) { 
    /**
     * @type {Array<string>}
     */
    const results = [ ];

    bot.categories.forEach( innerDir => { 
        
        innerDir = path.resolve( dir, innerDir );
        
        const stat = fs.statSync( innerDir );

        if ( stat.isDirectory ) { 
            results.push( ...findNested( innerDir, pattern ) );
        }

        if ( stat.isFile && innerDir.endsWith( pattern ) ) { 
            results.push( innerDir );
        }
    } );

    return results;
}

// Reading the command directory
const CMD_FILES = findNested( "./commands/", ".js" );

if ( CMD_FILES.length === 0 ) {
    console.log( "There are no commands to load on here." );
} else { 
    CMD_FILES.forEach( async ( f ) => { 
        const CMD = await import( f );

        console.log( `${i + 1}: ${f}!` );

        const { name, aliases } = CMD;

        bot.commands.set( name, CMD );

        if ( Array.isArray( aliases ) ) aliases.forEach( ( a ) => { 
            bot.aliases.set( a, name );
        } );
    } ); 
}

// Logs a message when the client connects to the group chat
// Note: The handler should only be ran once
bot.on( "ready", ( ) => { 

    const { user : { tag } } = bot;

    console.log( `${ tag } has connected to the group chat!` );

    bot.user.setActivity( "PantherBot" );
} );

// Checks a message every time it is sent
bot.on( "message", ( msg ) => { 

    const { content, author, channel, guild } = msg;

    if ( author.bot ) return;

    if ( content.startsWith( CMD_PREFIX ) ) { 
        
        const [ CMD_NAME_ORIG, ...CMD_ARGS ] = content
            .trim( )
            .substring( CMD_PREFIX.length )
            .split( /\s+/g );
        
        const CMD_NAME = CMD_NAME_ORIG.toLowerCase( );

        let CMD;

        if ( bot.commands.has( CMD_NAME ) ) { 
            CMD = bot.commands.get( CMD_NAME );
        } else {
            CMD = bot.commands.get( bot.aliases.get( CMD_NAME ) );
        }

        if ( CMD ) CMD.run( { msg, channel, guild, args : CMD_ARGS, author, member, bot } );
    }
} );

bot.on( "guildMemberAdd", ( member ) => { 
    console.log( member );
    const { guild, id } = member;
    const lobby = guild.channels.cache.find( c => c.name === "lobby" );
    if ( !lobby ) return;
    join.send( { channel : lobby, id, guild } );
} );

bot.on( "guildMemberRemove", ( member ) => { 
    const { guild, user, id } = member;
    const { channels } = guild;
    const lobby = channels.cache.find( c => c.name === "lobby" );

    if ( lobbyChannel ) { 
        leave.send( { channel : lobby, user, id } );
    }
} );

bot.login( token );