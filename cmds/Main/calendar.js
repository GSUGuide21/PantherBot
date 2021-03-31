const { Command } = require( "discord.js-commando" );
const { Message, MessageEmbed, Channel } = require( "discord.js" );
const scheduleSchema = require( "@models/scheduleSchema" );
const { URL } = require( "url" );
const { DateTime } = require( "luxon" );

function validateImage( url ) { 
    const urlO = new URL( url );

    const { host, protocol } = urlO;

    if ( protocol !== "https" ) return false;

    const allowedHosts = Object.freeze( [ 
        "i.redd.it",
        "cdn.discordapp.com",
        "*.imgur.com",
        "pbs.twimg.com"
    ] );

    const patterns = allowedHosts.map( h => { 
        const r = h
            .replace( ".", "\\." )
            .replace( "*", "(?:*.)" );

        return new RegExp( r );
    } );

    return patterns.some( pattern => { 
        return pattern.test( host );
    } );
}

module.exports = class CalendarCommand extends Command { 
    constructor( bot ) { 
        const twoDays = Date.now( ) + ( 1000 * 60 * 60 * 24 * 2 );

        const twoDaysDateString = DateTime
            .fromMillis( twoDays )
            .toLocaleString( { 
                weekday : "long",
                year : "numeric",
                day : "2-digit",
                month : "long",
                hour12 : true,
                hour : "2-digit",
                minute : "2-digit",
                timeZone : "America/New_York"
            } );

        super( bot, { 
            name : "calendar",
            memberName : "calendar",
            aliases : [ "events", "event", "schedule", "cal" ],
            group : "main",
            description : "Add an event to the calendar",
            args : [
                { 
                    key : "title",
                    prompt : "Enter the event title!",
                    type : "string"
                },
                {
                    key : "location",
                    prompt : "Enter the event location!",
                    type : "string"
                },
                { 
                    key : "date",
                    prompt : "Enter the event date!",
                    default : twoDaysDateString,
                    type : "string"
                },
                {
                    key : "image",
                    prompt : "Enter an image for the event.",
                    type : "string",
                    default : ""
                },
            ]
        } );
    }
    /**
     * @typedef {Object} CalendarArgs
     * @property {string} title
     * @property {string} location
     * @property {string} date
     * @property {string} image
     */

    /**
     * @param {Message} message
     * @param {CalendarArgs} args
     */
    async run( message, args ) { 
        const { 
            title, 
            location, 
            date, 
            image 
        } = args;

        const embed = new MessageEmbed( { 
            color : 0x081f80,
            title : "Calendar",
            fields : [ 
                { name : "Event Title", value : title }
            ]
        } );

        const d = DateTime.fromFormat( date, "M/d/yyyy h:mm a" );

        console.log( d );

        embed.fields.push( { 
            name : "Event Date",
            value : d.toLocaleString( { 
                weekday : "long",
                year : "numeric",
                day : "2-digit",
                month : "long",
                hour12 : true,
                hour : "2-digit",
                minute : "2-digit",
                timeZone : "America/New_York"
            } )
        } );

        if ( location ) { 
            embed.fields.push( { 
                name : "Event Location",
                value : location
            } );
        }

        if ( image ) { 
            const validated = validateImage( image );
            if ( validated ) embed.setImage( image );
        }

        embed.setTimestamp( Date.now( ) );

        return message.channel.send( { embed } );
    }
}