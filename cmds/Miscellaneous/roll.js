const { Command } = require( "discord.js-commando" );

module.exports = class RollCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "roll",
			aliases : [ "roll-dice", "dice" ],
			argsType : "single",
			memberName : "roll",
			group : "miscellaneous",
			description : "Makes PantherBot roll a dice."
		} );
	}

	async run( message, args ) { 
		let limit = parseInt( args );

		if ( 
			isNaN( args ) || 
			!isFinite( args ) ||
			limit === 0 
		) limit = 6;

		if ( limit < 0 ) limit = Math.abs( limit );

		const emptyArray = new Array( limit );

		const possibleIntegers = 
			Array
				.from( emptyArray )
				.fill( null )
				.map( ( _, i ) => i + 1 );
		
		const randomIndex = Math.floor( Math.random( ) * ( possibleIntegers.length ) );

		const result = possibleIntegers[ randomIndex ];

		return message.channel.send( `PantherBot just rolled a die. The number is ***${result}***!` );
	}
}