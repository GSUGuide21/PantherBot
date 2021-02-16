const { Command } = require( "discord.js-commando" );

module.exports = class BanCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "ban",
			group : "moderation",
			memberName : "ban",
			description : "Bans a member from the Discord server.",
			clientPermissions : [ "BAN_MEMBERS" ],
			userPermissions : [ "BAN_MEMBERS" ]
		} );
	}

	async run( message ) { 
		const target = message.mentions.users.first( );
		if ( !target ) return message.reply( "Please specify a user to ban." );
		const { guild } = message;

		const member = guild.members.cache.get( target.id );

		if ( member.bannable ) { 
			return member.ban( );
		} else {
			return message.reply( "you cannot ban that user!" );
		}
	}
}