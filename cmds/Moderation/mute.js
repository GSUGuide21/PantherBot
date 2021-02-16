const { Command } = require( "discord.js-commando" );


module.exports = class MuteCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "kick",
			group : "moderation",
			memberName : "ban",
			description : "Mutes a member on the Discord server",
			clientPermissions : [ "MUTE_MEMBERS" ],
			userPermissions : [ "MUTE_MEMBERS" ]
		} );
	}

	async run( message, args ) { 
		console.log( args );
		return message.channel.send( "TODO" );
		/*
		if ( args.length < 2 ) return message.reply( "Please specify a reason for muting." );

		const target = message.mentions.users.first( );
		if ( !target ) return message.reply( "Please specify a user to mute." );
		const { guild } = message;

		const member = guild.members.cache.get( target.id );
		*/
	}
}