const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

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

	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async run( message, args ) { 
		const target = message.mentions.users.first( );
		if ( !target ) return message.reply( "Please specify a user to ban." );
		const { guild } = message;

		args.shift( );

		const member = guild.members.cache.get( target.id );

		const reason = args.join( " " );

		if ( member.bannable ) { 
			member.ban( { reason } );
		} else {
			return message.reply( "you cannot ban that user!" );
		}
	}
}