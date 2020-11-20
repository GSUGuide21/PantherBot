import Discord from "discord.js";
import fs from "fs-extra";

export default {
	commands : "riddle",
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg ) {
		msg.channel.startTyping( );

		fs.readFile( "./../../txt/riddles.txt", "utf-8" )
			.then( ( txt ) => { 
				const pattern = /^\*\s*([\s\S]+)$/gm;
				const riddles = [ ];

				let v = null;

				while ( ( v = pattern.exec( txt ) ) ) {
					const [ , r ] = v;

					riddles.push( r );
				}

				const { length } = riddles;
				const index = Math.floor( Math.random( ) * length );

				const t = riddles[ index ];
				msg.channel.send( t );
			} )
			.catch( ( err ) => { 
				console.error( err );

				msg.channel.send( "I don't have any riddles to give you today." );
			} )
			.finally( ( ) => msg.channel.stopTyping( ) );
	}
};