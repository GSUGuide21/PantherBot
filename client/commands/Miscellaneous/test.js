const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class TestCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "test",
			memberName: "test",
			group: "miscellaneous",
			description: "Tests PantherBot!",
			aliases: [ "check" ]
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( { member, channel } ) { 
		this.client.initLeft( member );
		return channel.send( "Test completed!" );
	}
}