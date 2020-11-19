import Discord from "discord.js";

export default { 
	commands : [ "test" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg ) { 
		msg.channel.send( "PantherBot is currently being tested. Give it a second!" );

		let t = setTimeout( ( ) => { 
			clearTimeout( t );
			t = null;

			msg.channel.send( "Testing complete! You can go back to your regularly scheduled programming." );
		}, 2500 );
	}
};