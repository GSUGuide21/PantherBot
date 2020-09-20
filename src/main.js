/**
 * @name        PantherBot
 * @version     0.6.0
 * @author      GSUGuide21 <https://github.com/GSUGuide21>
 **/
// import express from "express";
// import bodyParser from "body-parser";
import Discord from "discord.js";
import { Message } from "discord.js";
import { Client } from "discord.js";
// import { MongoClient } from "mongodb";
import roles from "./roles.js";
import Commands from "./commands.js";
// import Events from "./events";
// import config from "./config";

// const app = express( );
const bot = new Client( );
const token = "NzU3MDQ2MTU4MTQ4MzcwNDcz.X2asLQ.JPpBHgmK_B9EGovbpcwJaEfgroA";
const parse = ( { content } ) => { 
    const [ command, ...args ] = content.split( /\s+/g );
    const commandName = command.replace( /^(?:\!|\/)/, "" );
    if ( typeof Commands[ commandName ] === "function" ) { 
        return { commandName, args, valid : true };
    } else {
        return { commandName, valid : false }
    }
};

bot.on( "message", msg => { 
    const { author: { id } } = msg;
    if ( id === bot.user.id ) return;
    const { valid, commandName, args } = parse( msg );
    const { channel: { send } } = msg;
    if ( valid ) { 
        const val = Commands[ commandName ]( msg, args );
        if ( val !== void 0 ) send( val );
    } else {
        msg.reply( `The following command is invalid: ${ commandName }.` );
        // Commands.help( );
    }
} );

bot.on( "ready", ( ) => { 
    console.log( "Bot is now connected!" );
} );

bot.login( token );