import express from "express";
import bodyParser from "body-parser";
import Discord from "discord.js";
import { Message } from "discord.js";
import { BotClient } from "discord.js";
import { MongoClient } from "mongodb";
import Commands from "./commands";
import Events from "./events";
import config from "./config";

const app = express( );
const bot = new BotClient( );

app.use( bodyParser.json( ) );

app.post( "/", handleRequest );
app.post( "/:guildId", handleRequest );

const handleRequest = ( req, res ) => { 
    const ev = req.get( "X-Github-Event" );
    if ( ev ) {
        const msg = Events[ ev ]( req.body );
        const repo = req.body.repository.full_name.toLowerCase( );
        sendMessages( repo, msg, req.params.guildId );
        res.sendStatus( 200 );
    } else {
        res.sendStatus( 400 );
    }
};

app.get( "/", ( req, res ) => { 
    res.send( "This address is not meant to be accessed by a web browser." );
} );

const sendMessages = ( repo, msg, guildId ) => { 
    MongoClient.connect( config.db, ( err, db ) => { 
        if ( err ) reject( err );
        db.collection( "subscriptions" ).find( { } )
    } );
};