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

		return channel.send( active ? "ACTIVE" : "INACTIVE" );
	}
}