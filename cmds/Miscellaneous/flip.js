const { Command } = require( "discord.js-commando" );

module.exports = class FlipCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "flip",
			memberName : "flip",
			group : "miscellaneous",
			description : "Allows PantherBot to perform a coin flip"
		} );
	}

	async run( message ) { 
		const coins = Object.freeze( [ "Heads", "Tails" ] );
		const randomIndex = Math.floor( Math.random( ) * coins.length );
		const coin = coins[ randomIndex ];
		return message.channel.send( `PantherBot has flipped a coin. It was ***${ coin }***!` );
	}
}