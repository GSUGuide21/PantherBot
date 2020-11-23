import Discord from "discord.js";

export default { 
	commands : [ "b2t", "btt", "binary-to-text" ],
	/**
	 * @method run
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) { 
		let res = "";

		let bl = text.replace( /\s+/, "" );

		while ( bl.length ) {
			const b = bl.substr( 0, 8 );

			bl = bl.substr( 8 );

			res = res.concat( String.fromCharCode( parseInt( b, 2 ) ) )
		}
		
		msg.channel.send( res );
	}
}