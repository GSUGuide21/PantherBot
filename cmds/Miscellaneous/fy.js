const { Command } = require( "discord.js-commando" );

module.exports = class FUCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "fy",
			aliases : [ "fuckyou", "fu" ],
			memberName : "fy",
			group : "Miscellaneous",
			description : "Makes PantherBot reply \"fuck you\"."
		} );
	}

	async run( message ) { 
		return message.reply( "fuck you!" );
	}
}