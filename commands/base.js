import Discord from "discord.js";
import { prefix } from "./../util/prefix.js";

console.log( prefix );

function validatePermissions( permissions ) { 
	const canonicalPermissions = Object.freeze( [ 
		"CREATE_INSTANT_INVITE",
		"KICK_MEMBERS",
		"BAN_MEMBERS",
		"ADMINISTRATOR",
		"MANAGE_CHANNELS",
		"MANAGE_GUILD",
		"ADD_REACTIONS",
		"VIEW_AUDIT_LOG",
		"PRIORITY_SPEAKER",
		"STREAM",
		"VIEW_CHANNEL",
		"SEND_MESSAGES",
		"SEND_TTS_MESSAGES",
		"MANAGE_MESSAGES",
		"ATTACH_FILES",
		"READ_MESSAGE_HISTORY",
		"MENTION_EVERYONE",
		"USE_EXTERNAL_EMOJIS",
		"VIEW_GUILD_INSIGHTS",
		"CONNECT",
		"SPEAK",
		"MUTE_MEMBERS",
		"DEAFEN_MEMBERS",
		"MOVE_MEMBERS",
		"USE_VAD",
		"CHANGE_NICKNAME",
		"MANAGE_NICKNAMES",
		"MANAGE_ROLES",
		"MANAGE_WEBHOOKS",
		"MANAGE_EMOJIS"
	] );

	for ( const permission of permissions ) { 
		if ( !canonicalPermissions.includes( permission ) ) {
			throw new Error( `Unknown permissions node: ${permission}.` );
		}
	}
}

/**
 * @param {Discord.Client} bot
 * @param {Object} options
 */
export default ( bot, options = { } ) => {
	let {
		commands,
		expectedArgs = '',
		permissionError = 'You do not have permissions to run this command.',
		minArgs = 0,
		maxArgs = null,
		permissions = [ ],
		requiredRoles = [ ],
		run,
		done = ( ) => { },
		error = ( ) => { },
		always = ( ) => { }
	} = options;

	// Ensures the commands are in an array
	if ( typeof commands === "string" ) {
		commands = [ commands ];
	}

	// Ensures the permissions are in an array and are valid
	if ( permissions.length ) { 
		if ( typeof permissions === "string" ) {
			permissions = [ permissions ];
		}

		validatePermissions( permissions );
	}

	bot.on( "message", msg => { 
		const { member, content, guild, author } = msg;

		if ( author.bot ) return;

		for ( const alias of commands ) {
			const atl = alias.toLowerCase( );
			const cmd = `${prefix}${atl}`;

			const ctl = content.toLowerCase( );

			if ( 
				ctl.startsWith( `${cmd} ` ) ||
				ctl === cmd 
			) {
				for ( const permission of permissions ) {
					if ( !member.hasPermission( permission ) ) {
						msg.reply( permissionError );
						return;
					}
				}

				for ( const reqRole of requiredRoles ) {
					const role = guild.roles.cache.find( r => r.name === reqRole );

					if ( !role || !member.roles.cache.has( role.id ) ) {
						msg.reply( 
							`You must have the ${reqRole} role to use this command.`
						);
						return;
					}
				}

				const args = content.split( /\s+/g );

				args.shift( );

				if ( 
					args.length < minArgs ||
					( maxArgs !== null && args.length > maxArgs )
				) {
					msg.reply( 
						`The syntax is incorrect! Please use ${cmd} ${expectedArgs}`
					);
					return;
				}

				run( msg, args, args.join( " " ), bot )
					.then( done )
					.catch( error )
					.finally( always );
				
				return;
			}
		}
	} );
};