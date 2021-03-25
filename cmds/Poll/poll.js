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
			argsCount : 3
		} );
	}

	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async run( message, args ) { 
		
	}
}