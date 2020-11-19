import Discord from "discord.js";

export default {
	commands : [ "ban" ],
	requiredPermissions : [ "BAN_MEMBERS", "ADMINISTRATOR" ],
	permissionError : "You do not have permissions to ban this user.",
	minArgs : 1,
	maxArgs : 2,
	expectedArgs : "<member to ban> <?reason>",
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args ) { 
		const target = msg.guild.member( 
			msg.mentions.users.first( ) ||
			msg.guild.members.cache.get( args[ 0 ] )
		);

		const reason = args.slice( 1 ).join( " " );

		const update = msg.guild.channels.cache.find( x => x.name === "update" );

		const embed = new Discord.MessageEmbed( { 
			color : 0x3a4d8a,
			title : "Banned",
			thumbnail : {
				url : target.user.avatarURL( )
			},
			fields : [ 
				{ 
					name : "Member",
					value : target.user.username
				},
				{
					name : "Performer",
					value : msg.author.username
				},
				{
					name : "Reason",
					value : reason
				}
			]
		} );

		target.ban( reason );

		update.send( { embed } );
	}
};