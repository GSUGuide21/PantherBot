const { Command } = require( "discord.js-commando" );

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

		const context = require( "2d-context" )( { 
			width : 640,
			height : 400
		} );

		console.log( context );

		return channel.send( active ? "ACTIVE" : "INACTIVE" );
	}
}