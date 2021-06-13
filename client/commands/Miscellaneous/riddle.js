const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );
const { riddles } = require( "../../features/riddles.json" );

module.exports = class RiddleCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "riddle",
			memberName: "riddle",
			group: "miscellaneous",
			description: "Sends a random riddle to the channel."
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( { channel } ) { 
		const index = Math.floor( Math.random( ) * riddles.length );
		const riddle = riddles[ index ];

		return channel.send( riddle );
	}
}