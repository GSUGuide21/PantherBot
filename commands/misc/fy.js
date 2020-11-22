import Discord from "discord.js";

export default { 
	commands : [ "fy" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg ) { 
		msg.reply( "fuck you!" );
	}
}