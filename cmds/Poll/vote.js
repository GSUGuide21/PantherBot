const { Command } = require( "discord.js-commando" );
const { MessageEmbed, Message } = require( "discord.js" );

module.exports = class VoteCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "vote",
			aliases : [ "v" ],
			group : "vote",
			memberName : "vote",
			description : "",
			argsType : "multiple",
			argsCount : 3
		} );
	}

	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async run( message, args ) { 
        const emojiNames = Object.freeze( [ "support", "neutral", "oppose" ] );

        const emojis = emojiNames.map( emoji => { 
            return message.guild.emojis.cache.find( em => em.name === emoji );
        } );

        const mention = message.mentions.channels.first( );

        const argIndex = mention ? 1 : 0;

        const channel = mention ? mention : message.channel;

        const voteQuestion = args.slice( argIndex ).join( " " );

		const embed = new MessageEmbed( { 
            color : "RANDOM",
            description : voteQuestion,
            fields : emojis.map( emoji => { 
                const name = emoji
                    .name
                    .toUpperCase( )
                    .replace( /^:|:$/g, "" );

                const value = emoji;

                return { name, value, inline : true };
            } )
        } );

        channel
            .send( { embed } )
            .then( msg => { 
                for ( const emoji of emojis ) msg.react( emoji );
            } );
	}
}