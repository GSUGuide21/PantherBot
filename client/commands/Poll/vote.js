const { Command } = require( "discord.js-commando" );
const { MessageEmbed, Message } = require( "discord.js" );

module.exports = class VoteCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "vote",
			aliases : [ "v" ],
			group : "poll",
			memberName : "vote",
			description : "Similar to the poll command; however, it only allows for voting support, neutral, or oppose.",
			argsType : "multiple"
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( message ) { 
        const { mentions, guild, channel, member, author } = message;
        const types = Object.freeze( [ "support", "neutral", "oppose" ] );
        const emojis = types.map( type => guild.emojis.cache.find( em => em.name === type ) );

        const target = mentions.channels.first( ) ?? channel;
        const initial = await channel.send( `${member}, please describe what the user is voting on.` );

        try { 
            const collected = await channel.awaitMessages( m => m.author.tag === author.tag, { 
                time: 30 * 1000,
                max: 1
            } );

            const { content = "" } = collected.first( );

            if ( content === "" ) return channel.send( "No description has been provided." );

            initial.delete( );

            const embed = new MessageEmbed( { 
                description: content,
                color: 0x344480,
                title: "VOTE",
                fields: emojis.map( emoji => ( { 
                    value: emoji, 
                    name: emoji.name.toUpperCase( ).replace( /^:|:$/g, "" ),
                    inline: true
                } ) ),
                footer: { 
                    iconURL: author.displayAvatarURL( { 
                        dynamic: true
                    } ),
                    text: `${member}`
                }
            } );

            const comp = await target.send( { embed } );

            for ( const ej of emojis ) await comp.react( ej );
        } catch { 
            return channel.send( "No description has been provided." );
        }
	}
}