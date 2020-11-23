import Discord from "discord.js";

export default { 
	commands : [ "mute" ],
	requiredPermissions : [ "MUTE_MEMBERS", "ADMINISTRATOR" ],
	permissionError : "You do not have permissions to mute this user.",
	minArgs : 1,
	maxArgs : 2,
	expectedArgs : "<member to mute> <?reason>",
	/**
	 * @method run
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) {
		const target = msg.guild.member( 
			msg.mentions.users.first( ) ||
			msg.guild.members.cache.get( args[ 0 ] )
		);

		const reason = args.slice( 1 ).join( " " );

		const update = msg.guild.channels.cache.find( x => x.name === "update" );

		
	}
}