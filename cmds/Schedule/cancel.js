const { Command } = require( "discord.js-commando" );
const { Message, MessageEmbed } = require( "discord.js" );
const { Schema } = require( "mongoose" );
const escapeRegexp = require( "@root/escapeRegexp" );

/** @type {Schema} */
const scheduleSchema = require( "@models/scheduleSchema" );

module.exports = class CancelCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "cancel",
            memberName : "cancel",
            aliases : [ "unschedule" ],
            group : "schedule",
            description : "Cancels an event on the calendar.",
            args : [ 
                { 
                    key : "title",
                    prompt : "Enter the event title!",
                    type : "string",
                    default : ""
                }
            ]
        } );
    }

    /**
     * @typedef {Object} CalendarArgs
     * @property {string} title
     */

    /**
     * @param {Message} message
     * @param {CalendarArgs} args
     */
    async run( message, args ) { 
        const { title } = args;

        if ( !title ) return message.reply( "a title is required for an event is cancelled." );

        const escapedTitle = escapeRegexp( title );

        const titlePattern = new RegExp( `^${escapedTitle}$`, "i" );

        const query = { 
            eventTitle : titlePattern
        };

        const result = await scheduleSchema
            .findOne( query )
            .catch( ( ) => { error : "Error" } );

        console.log( await scheduleSchema.findOne( query ), query, result );
        
        if ( !result.error ) return message.reply( "no events with that title has been found." );

        const embed = new MessageEmbed( { 
            color : 0x081f60,
            title : "Event Cancelled",
            fields : [ { name : "Title", value : title } ]
        } );

        message
            .channel
            .send( { embed } )
            .then( ( ) => { 
                if ( message.deletable ) message.delete( );
            } );

        await scheduleSchema.deleteOne( query );
    }
};