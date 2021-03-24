const { Command } = require( "discord.js-commando" );
const getContext = require( "2d-context" );

module.exports = class TestCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "test",
			group : "miscellaneous",
			memberName : "test",
			description : "This is PantherBot's test command."
		} );
	}

	async run( { channel } ) { 
		const { active } = this.client;

		const context = getContext( { 
			width : 640,
			height : 400
		} );

		const { canvas } = context;

		return channel.send( active ? "ACTIVE" : "INACTIVE" );
	}
}