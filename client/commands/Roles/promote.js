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

		if ( !members.size ) return message.reply( "please specify at least one user to promote." );

		members.forEach( async member => { 
			const currentRoleName = order.find( roleName => { 
				const currentRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === roleName );
				console.log( currentRole );
				return member.roles.cache.has( currentRole );
			} );

			console.log( currentRoleName );
	
			if ( !currentRoleName ) { 
				const lastIndex = order.length - 1;
				const lastRoleName = order[ lastIndex ];
	
				const lastRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === lastRoleName );
				return await member.roles.add( lastRole );
			}

			console.log( currentRoleName );
	
			const topRoleName = order[ 0 ];
	
			if ( currentRoleName === topRoleName ) { 
				return message.reply( `you cannot promote ${member.displayName} anymore.` );
			}

			const currentRoleIndex = order.indexOf( currentRoleName );
			const currRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === currentRoleName );

			console.log( currRole, currentRoleIndex );

			const nextRoleIndex = currentRoleIndex - 1;
			const nextRoleName = order[ nextRoleIndex ];
			const nextRole = guild.roles.cache.find( role => role.name.toLowerCase( ) === nextRoleName );

			console.log( nextRole, nextRoleIndex, nextRoleName );

			return await member
				.roles
				.remove( currRole )
				.then( async ( ) => { 
					return await member.roles.add( nextRole );
				} );
		} );
	}
}