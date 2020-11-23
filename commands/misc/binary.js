import Discord from "discord.js";

export default { 
	commands : [ "binary" ],
	/**
	 * @method run
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) { 
		const string = text.trim( );
		
		const res = Array.from( string )
			.map( c => { 
				const b = c.charCodeAt( 0 ).toString( 2 );

				const d = Math.max( 8 - b.length, 0 );

				return '0'.repeat( d ) + b;
			} )
			.join( "" );
		
		msg.channel.send( res );
	}
}