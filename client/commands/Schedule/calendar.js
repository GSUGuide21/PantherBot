const { Command, Client } = require( "discord.js-commando" );
const { Message, MessageEmbed } = require( "discord.js" );
/** @type {Model} */
const scheduleSchema = require( "../../features/models/scheduleSchema" );
const { URL } = require( "url" );
const { DateTime } = require( "luxon" );
const { Model } = require( "mongoose" );

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
    /**
     * Initializes the Command constructor
     * @param {Client} bot 
     */
    constructor( bot ) { 
        const twoDays = Date.now( ) + ( 1000 * 60 * 60 * 24 * 2 );

        const twoDaysDateString = DateTime
            .fromMillis( twoDays, { 
                zone : "America/New_York"
            } )
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

        async function checkForEvents( ) { 
            const query = { 
                eventDate : { 
                    $lte : Date.now( )
                }
            };
        
            const results = await scheduleSchema.find( query );
        
            for ( const event of results ) { 
                const { 
                    guildId,
                    channelId,
                    eventDay,
                    eventTime,
                    eventTitle,
                    eventLocation = "",
                    eventDescription = "",
                    eventImage = ""
                } = event;

                const embed = new MessageEmbed( { 
                    color : 0x081f60,
                    title : "Calendar",
                    fields : [ { name : "Title", value : eventTitle } ]
                } );

                if ( eventLocation ) { 
                    embed.fields.push( { 
                        name : "Location",
                        value : eventLocation
                    } );
                }

                if ( eventDescription ) { 
                    embed.setDescription( eventDescription );
                }

                embed.fields.push( {
                    name : "Date",
                    value : eventDay,
                    inline : true
                },
                { 
                    name : "Time",
                    value : eventTime,
                    inline : true
                } );
                
                if ( eventImage ) { 
                    const validated = validateImage( eventImage );
                    if ( validated ) embed.setImage( eventImage );
                }

                embed.setTimestamp( Date.now( ) );

                const guild = await bot.guilds.fetch( guildId );
                if ( !guild ) continue;

                const channel = guild.channels.cache.get( channelId );
                if ( !channel ) continue;

                channel.send( { embed } );
            }
        
            await scheduleSchema.deleteMany( query );
        
            setTimeout( checkForEvents, 1000 * 10 );
        }

        checkForEvents( );

        super( bot, { 
            name : "calendar",
            memberName : "calendar",
            aliases : [ "events", "event", "schedule", "cal" ],
            group : "schedule",
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
            color : 0x081f60,
            title : "Calendar",
            fields : [ 
                { 
                    name : "Organizer", 
                    value : `${message.member?.displayName || message.author.username} (${message.author.tag})` 
                },
                { 
                    name : "Title", 
                    value : title 
                }
            ],
            thumbnail : message.author.displayAvatarURL( { dynamic : true } )
        } );

        if ( location ) { 
            embed.fields.push( { 
                name : "Location",
                value : location
            } );
        }

        const collectorMsg = await message.channel.send( "What description do you want for your event?" );

        const collector = message.channel.awaitMessages( m => { 
            return m.author.id === message.author.id;
        }, { 
            max : 1,
            time : 20 * 1000
        } );

        const description = await collector
            .then( collected => { 
                if ( collectorMsg.deletable ) collectorMsg.delete( );
                const msg = collected.first( );
                if ( !msg ) throw "No description available.";

                const { content } = msg;

                if ( msg.deletable ) msg.delete( );
                return content;
            } )
            .catch( e => String( e ) );
        
        embed.setDescription( description );

        const d = DateTime.fromFormat( date, "M/d/yyyy h:mm a", { 
            zone : "America/New_York"
        } );

        const dateString = d.toLocaleString( { 
            weekday : "long",
            year : "numeric",
            day : "numeric",
            month : "long",
            timeZone : "America/New_York"
        } );

        const timeString = d.toLocaleString( { 
            hour12 : true,
            hour : "numeric",
            minute : "2-digit",
            timeZone : "America/New_York"
        } );

        const iso = d.toISO( );

        const dateObject = new Date( iso );

        embed.fields.push( { 
            name : "Date",
            value : dateString,
            inline : true
        }, 
        { 
            name : "Time",
            value : timeString,
            inline : true
        } );

        if ( image ) { 
            const validated = validateImage( image );
            if ( validated ) embed.setImage( image );
        }

        embed.setTimestamp( Date.now( ) );

        message
            .channel
            .send( { embed } )
            .then( ( ) => { 
                if ( message.deletable ) message.delete( );
            } );

        const schema = await new scheduleSchema( { 
            eventDate : dateObject.valueOf( ),
            eventDay : dateString,
            eventTime : timeString,
            eventTitle : title,
            eventLocation : location,
            eventDescription : description,
            eventImage : image,
            guildId : message.guild.id,
            channelId : message.channel.id
        } );

        schema.save( );
    }
}