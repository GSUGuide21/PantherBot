const { Command } = require( "discord.js-commando" );
const { Message, MessageEmbed } = require( "discord.js" );
const scheduleSchema = require( "@models/scheduleSchema" );


module.exports = class CalendarCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "calendar",
            memberName : "calendar",
            aliases : [ "events", "event", "schedule", "cal" ],
            group : "main",
            description : "Add an event to the calendar"
        } );
    }

    /**
     * @param {Message} message,
     * @param {string[]} args
     */
    async run( message, args ) { 
        const titleCollector = message.channel.awaitMessages( m => { 
            const isAuthor = message.author.id === m.author.id;
            return isAuthor;
        }, { 
            time : 10 * 10000,
            max : 1,
            errors : [ "time" ]
        } );

        titleCollector
            .then( collected => { 
                const { content } = collected.first( );
                const result = content.trim( );

                console.log( result );
            } );
    }
}