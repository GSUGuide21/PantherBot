const { Command } = require( "discord.js-commando" );

module.exports = class KickCommand extends Command { 
	constructor( bot ) {
		super( bot, { 
			name : "kick",
			group : "moderation",
			memberName : "kick",
			description : "Kicks a member from the Discord server.",
			clientPermissions : [ "KICK_MEMBERS" ],
			userPermissions : [ "KICK_MEMBERS" ]
		} );
	}

	async run( message ) { 
		const target = message.mentions.users.first( );
		if ( !target ) return message.reply( "Please specify someone to kick!" );
		const { guild } = message;

		const member = guild.members.cache.get( target.id );

		if ( member.kickable ) {
			return member.kick( );
		} else {
			return message.reply( "you cannot kick that user." );
		}
	}
}