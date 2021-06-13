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
	async run( { channel } ) { 
		return channel.send( `${this.client.active ? "ACTIVE" : "NOT ACTIVE"}` );
	}
}