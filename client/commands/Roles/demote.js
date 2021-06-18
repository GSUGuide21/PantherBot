const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class PromoteCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "promote",
			memberName: "promote",
			group: "roles",
			description: "Promotes a user to the next group."
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( message ) { 
		const { mentions, guild } = message;
		const { order } = require( "../../features/role-order.json" );

		const members = mentions.members;

		if ( !members.size ) return message.reply( "please specify at least one user to demote." );

		members.forEach( async member => { 
			const currentRoleName = order.find( roleName => { 
				const currentRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === roleName );
				return member.roles.cache.has( currentRole );
			} );
	
			if ( !currentRoleName ) { 
				return message.reply( `you cannot demote this user (${member.displayName}).` );
			}
			
			const lastIndex = order.length - 1;
			const bottomRoleName = order[ lastIndex ];
			const bottomRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === bottomRoleName );
	
			if ( currentRoleName === bottomRoleName ) { 
				return await member.roles.remove( bottomRole );
			}

			const currentRoleIndex = order.indexOf( currentRoleName );
			const currRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === currentRoleName );

			const prevRoleIndex = currentRoleIndex + 1;
			const prevRoleName = order[ prevRoleIndex ];
			const prevRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === prevRoleName );

			return await member
				.roles
				.remove( currRole )
				.then( async ( ) => { 
					return await member.roles.add( prevRole );
				} );
		} );
	}
}