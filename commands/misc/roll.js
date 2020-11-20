import Discord from "discord.js";

export default { 
	commands : [ "roll-dice", "roll", "dice" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args ) { 
		let limit = ( args.length > 0 && 
			( !isNaN( args[ 0 ] ) && 
				isFinite( args[ 0 ] ) ) ?
			parseInt( args[ 0 ] ) : 6 );
		
		if ( limit === 0 ) limit = 6;

		else if ( limit < 0 ) limit = Math.abs( limit );

		let a = new Array( limit );

		a = a.fill( null ).map( ( _, i ) => i + 1 );

		let r = Math.floor( Math.random( ) * ( a.length ) );

		let n = a[ r ];

		return msg.channel.send( `PantherBot just rolled a die. He landed on the number ${n}!` );
	}
};