const { Message } = require( "discord.js" );
const { Command } = require( "discord.js-commando" );

module.exports = class KickCommand extends Command { 
	constructor( bot ) {
		super( bot, { 
			name : "kick",
			group : "moderation",
			memberName : "kick",
			description : "Kicks a member from the Discord server.",
			argsType : "multiple",
			clientPermissions : [ "KICK_MEMBERS" ],
			userPermissions : [ "KICK_MEMBERS" ]
		} );
	}

	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async run( message, args ) { 
		const target = message.mentions.users.first( );
		if ( !target ) return message.reply( "Please specify someone to kick!" );
		const { guild } = message;

		args.shift( );
		const reason = args.join( " " );

		const member = guild.members.cache.get( target.id );

		if ( member.kickable ) {
			if ( reason ) member.kick( reason );
			else member.kick( );
		} else {
			return message.reply( "you cannot kick that user." );
		}
	}
}