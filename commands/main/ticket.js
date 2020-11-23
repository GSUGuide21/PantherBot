import Discord from "discord.js";

export default { 
	commands : [ "ticket", "support" ],
	minArgs : 1,
	expectedArgs : "<message>",
	/**
	 * @method run
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 * @param {Discord.Client} bot
	 */
	async run( msg, args, text, bot ) {
		const channelId = "780303682058190858";

		const channel = msg.guild.channels.cache.get( channelId );

		console.log( text );
	}
}