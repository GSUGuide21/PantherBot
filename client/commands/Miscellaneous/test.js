const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );
const { MessageButton } = require( "discord-buttons" );
const PantherBotButtonController = require( "../../button" );

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
		const button = new MessageButton( { 
			style: "red",
			id: "pantherbot-test-button",
			label: "Testing"
		} );

		const target = await channel.send( "Click below:", button );
		const controller = new PantherBotButtonController( { target, button } );

		controller.on( "click", btn => { 
			btn.reply( "Test completed!" );
		} );
		// return channel.send( `${this.client.active ? "ACTIVE" : "NOT ACTIVE"}` );
	}
}