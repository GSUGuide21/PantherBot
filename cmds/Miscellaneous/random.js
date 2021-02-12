const { Command } = require( "discord.js-commando" );

module.exports = class RandomIntCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "random",
			aliases : [ "rand" ],
			memberName : "random",
			group : "miscellaneous",
			description : "Similar to the roll command; however, it allows you to use the second argument as the maximum number.",
			argsCount : 2,
			argsType : "multiple"
		} );
	}

	async run( { channel }, args ) { 
		const range = Array
			.from( args )
			.slice( 0, 2 )
			.map( number => Number( number ) );

		const { MIN_SAFE_INTEGER, MAX_SAFE_INTEGER } = Number;

		const safeIntegers = [ MIN_SAFE_INTEGER, MAX_SAFE_INTEGER ];

		let randomNumber = -Infinity;

		if ( range.length > 0 ) { 
			const [ x, y ] = safeIntegers.map( ( n, i ) => { 
				return ( isNaN( n ) || !isFinite( n ) ) ?
					safeIntegers[ i ] :
					Number( n );
			} );

			const [ min, max ] = [ Math.min( x, y ), Math.max( x, y ) ];

			randomNumber = Math.floor( Math.random( ) * ( max - min ) + min );
		} else { 
			randomNumber = Math.floor( Math.random( ) * ( safeIntegers[ 1 ] - safeIntegers[ 0 ] ) + safeIntegers[ 0 ] );
		}

		return channel.send( randomNumber );
	}
}