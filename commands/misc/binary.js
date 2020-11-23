import Discord from "discord.js";

export default { 
	commands : [ "binary" ],
	/**
	 * @method run
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args ) { 
		const string = args.join( " " );
        const result = Array.from( string )
            .reduce( ( a, c ) => a.concat( c.charCodeAt( ).toString( 2 ) ), [ ] )
            .map( b => "0".repeat( 8 - b.length ) + b )
            .join( " " );
		msg.channel.send( result );
	}
}