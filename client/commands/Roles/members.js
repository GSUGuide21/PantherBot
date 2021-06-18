const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );
const regescape = require( "../../features/util/escape-regex" );

module.exports = class MembersCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "members",
			memberName: "members",
			group: "roles",
			description: "Lists all members of a role."
		} );
	}

	/**
	 * @param {Message} message
	 * @param {string} roleName
	 */
	async run( message, roleName ) { 
		const { guild, channel } = message;
		const pattern = new RegExp( `^${regescape( roleName.trim( ) )}$`, "i" );
		const role = guild.roles.cache.find( r => pattern.test( r.name ) );

		if ( !role ) return message.reply( `invalid role: ${roleName}.` );

		const { members, name } = role;

		if ( !members.size ) return message.reply( `the role you have specified does not contain members.` );
		
		const names = members.map( member => member.displayName ?? member.user.username );
		return channel.send( `The member${members.size > 1 ? "s" : ""} of the ${name} role are: \n ${
			names.map( ( n, index ) => `${index === names.length - 1 ? n : `${n}\n` }` )
		}` );
	}
}