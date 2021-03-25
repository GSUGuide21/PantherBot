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
	async run( message, args ) { 
		if ( !args?.length ) return message.reply( "a poll must have at least 1 option." );

		const mention = message.mentions.channels.first( );

		const argIndex = mention ? 1 : 0;

		const channel = mention ? mention : message.channel;

		const pollOptions = args.slice( argIndex );

		const pollQuestion = pollOptions.shift( );

		const emojiNames = [ ];

		for ( let i = 0; i < pollOptions.length; i++ ) { 
			emojiNames[ i ] = `Number${String( i + 1 )}`;
		}

		const emojis = emojiNames.map( emoji => { 
			return message.guild.emojis.cache.find( 
				em => em.name === emoji
			);
		} );

		const embed = new MessageEmbed( { 
			color : "RANDOM",
			description : pollQuestion,
			fields : emojis.map( ( emoji, index ) => { 
				const name = pollOptions[ index ];

                const value = emoji;

                return { name, value, inline : true };
			} )
		} );

		channel
            .send( { embed } )
            .then( msg => { 
                if ( message.deletable ) message.delete( );
                for ( const emoji of emojis ) msg.react( emoji );
            } );
	}
}