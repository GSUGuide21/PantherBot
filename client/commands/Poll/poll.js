const { Command } = require( "discord.js-commando" );
const { MessageEmbed, Message } = require( "discord.js" );

module.exports = class PollCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "poll",
			aliases : [ "p" ],
			group : "poll",
			memberName : "poll",
			description : "Creates a poll with up to 15 options.",
			argsType : "multiple",
			argsSingleQuotes : true
		} );
	}

	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async run( message ) { 
		const { mentions, guild, channel, member, author } = message;
		const target = mentions.channels.first( ) ?? channel;
		const initial = await channel.send( `${member}, please state your question!` );

		try { 
			const collectedQ = await channel.awaitMessages( m => m.author.tag === author.tag, { 
				time: 20 * 1000,
				max: 1
			} );

			const collectedQMsg = collectedQ.first( );
			const { content: pollQuestion } = collectedQMsg;

			if ( pollQuestion === "" ) return channel.send( "Please specify a poll question." );
			collectedQMsg.delete( );
			initial.delete( );

			const selectOptions = await channel.send( `${member}, please choose your poll options.` );

			const collected = await channel.awaitMessages( m => m.author.tag === author.tag, { 
				time: 45 * 1000,
				max: this.client.pollLimit ?? 15
			} );

			const options = collected.map( m => m.content );
			collected.forEach( m => m.delete( ) );

			selectOptions.delete( );

			const embed = new MessageEmbed( { 
				description: pollQuestion,
				color: 0x6576ad,
				title: "POLL",
				fields: options.map( ( option, index ) => ( { 
					value: guild.emojis.cache.find( em => em.name === `Number${index + 1}` ),
					name: option,
					inline: true
				} ) ),
                footer: { 
                    iconURL: author.displayAvatarURL( { 
                        dynamic: true
                    } ),
                    text: `${member.displayName ?? author.username}`
                },
				timestamp: new Date( )
			} );

			const comp = await target.send( { embed } );
			const emojis = Array.from( 
				{ length: options.length }, 
				( _, i ) => guild.emojis.cache.find( em => em.name === `Number${i + 1}` ) 
			);

			for ( const ej of emojis ) await comp.react( ej );
			
			message.delete( );
		} catch { 
			return channel.send( "Failed to create a poll. Please try again." );
		}
	}
}