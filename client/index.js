const { MessageEmbed, GuildMember, User, Guild, Collection, Role, GuildChannel } = require( "discord.js" );
const { Client } = require( "discord.js-commando" );
const path = require( "path" );
const messages = require( "./features/messages.json" );
const mongoose = require( "mongoose" );

const filterEmojis = string => { 
	const allowedChars = Object.freeze( [ 
		"a-z", "0-9", "\\s", "\\-", "_",
		"\\&", "\\$", "\\#", "\\!", "\\(",
		"\\)", "\\[", "\\]"
	] );
	const pattern = new RegExp( "[^" + allowedChars.join( "" ) + "]", "gi" );
	return string.replace( pattern, "" );
};

module.exports = class PantherBotClient extends Client {
	constructor( opts = { } ) { 
		opts.name = "PantherBot";
		opts.owner = "707779366318243840";
		opts.commandPrefix = "$";

		super( opts );

		this.active = true;

		this.log( this );
	}

	toggle( msg ) { 
		this.active = !this.active;
		if ( msg ) this.log( msg );
	}

	log( msg ) { 
		const message = `PantherBot Log: ${msg}`;
		console.log( message );
	}

	warn( msg ) { 
		const message = `PantherBot Warning: ${msg}`;
		console.warn( message );
	}

	error( msg ) { 
		const message = `PantherBot Error: ${msg}`;
		console.error( message );
	}

	/**
	 * @param {Guild} guild 
	 */
	getUpdateChannel( guild ) { 
		return guild.channels.cache.find( c => { 
			const t = filterEmojis( c.name )
				.toLowerCase( )
				.replace( /\s+/g, " " )
				.trim( );
			return t === "update";
		} );
	}

	/**
	 * @param {Guild} guild 
	 */
	 getWelcomeChannel( guild ) { 
		return guild.channels.cache.find( c => { 
			const t = filterEmojis( c.name )
				.toLowerCase( )
				.trim( );
			return t === "welcome";
		} );
	}

	async initFeatures( ) { 
		this.once( "ready", this.initCommands.bind( this ) );
		this.initMessages( );
	}

	async initMessages( ) { 
		this.on( "guildMemberAdd", this.initJoin.bind( this ) );
		this.on( "guildMemberRemove", this.initRemove.bind( this ) );
		this.on( "guildBanAdd", this.initBanned.bind( this ) );
		this.on( "guildMemberUpdate", this.initUpdate.bind( this ) );
	}

	async initCommands( ) { 
		this.log( "Initialization completed. Loading commands now." );
		this.user.setActivity( "PantherBot", { type: "PLAYING" } );

		const groups = require( "./command-groups.json" );

		this
			.registry
			.registerGroups( Object.entries( groups ) )
			.registerDefaults( )
			.registerCommandsIn( path.join( __dirname, "commands" ) );
		
		this.connect( );
	}

	/**
	 * Initializes the guild join message
	 * @param {GuildMember} member 
	 */
	async initJoin( member ) { 
		const embed = new MessageEmbed( { 
			color: 0x3444cf,
			timestamp: new Date( ),
			title: "JOINED"
		} );

		const uc = member.guild.channels.cache.find( c => c.name === "update" );
		const wc = member.guild.channels.cache.find( c => c.name === "welcome" );

		const wm = messages.welcome;
		const message = wm[ Math.floor( Math.random( ) * wm.length ) ];

		const result = message
			.replace( "__M__", member )
			.replace( "__G__", member.guild.name );
		
		embed.fields.push( { 
			name: "USER NAME",
			value: member.user.tag
		} );

		embed.setThumbnail( member.user.displayAvatarURL( { 
			dynamic: true
		} ) );

		wc.send( result );
		return uc.send( { embed } );
	}

	/**
	 * Initializes the guild remove message
	 * @param {GuildMember} member 
	 */
	async initRemove( member ) { 
		const kickLogs = await member.guild.fetchAuditLogs( { 
			type: "MEMBER_KICK",
			limit: 1
		} );

		const banLogs = await member.guild.fetchAuditLogs( { 
			type: "MEMBER_BAN_ADD",
			limit: 1
		} );

		const kickLog = kickLogs.entries.first( );
		const banLog = banLogs.entries.first( );

		const currentDate = Date.now( );
		const delay = 1500;

		const { guild } = member;

		if ( kickLog ) { 
			const { 
				executor,
				target,
				createdTimestamp,
				reason
			} = kickLog;

			const execMember = member.guild.member( executor );
			const targetMember = member.guild.member( target );

			const diff = currentDate - createdTimestamp;

			if ( ( member.user.id === target.id ) && ( diff < delay ) ) { 
				return this.initKicked( { execMember, targetMember, guild, reason, executor, target } );
			}
		}

		if ( banLog ) { 
			const { createdTimestamp: banTimestamp, target } = banLog;
			const diff = currentDate - banTimestamp;

			if ( ( target.id === member.user.id ) && ( diff < delay ) ) return;
		}

		return this.initLeft( member );
	}

	/**
	 * Initializes the guild leave message
	 * @param {GuildMember} member
	 */
	async initLeft( member ) { 
		const uc = member.guild.channels.cache.find( c => c.name === "update" );
		const wc = member.guild.channels.cache.find( c => c.name === "welcome" );

		const lm = messages.left;
		const result = lm[ Math.floor( Math.random( ) * lm.length ) ];
		
		const message = result
			.replace( "__M__", member )
			.replace( "__G__", member.guild.name );
		
		const embed = new MessageEmbed( { 
			color: 0x56afff,
			title: "LEFT",
			timestamp: new Date( ),
			fields: [ { 
				name: "User",
				value: `${member?.displayName ?? member.user.username}`,
				inline: true
			} ]
		} );
		
		wc.send( message );
		return uc.send( { embed } );
	}

	/**
	 * Initializes the guild kick message
	 * @param {Object} event
	 * @param {User} event.executor
	 * @param {User} event.target
	 * @param {Guild} event.guild
	 * @param {GuildMember} event.execMember
	 * @param {GuildMember} event.targetMember
	 * @param {string|void} event.reason
	 */
	async initKicked( { executor, target, guild, targetMember, execMember, reason = "" } ) { 
		const uc = member.guild.channels.cache.find( c => c.name === "update" );
		const wc = member.guild.channels.cache.find( c => c.name === "welcome" );

		const embed = new MessageEmbed( { 
			color: 0xdfaaa0,
			title: "KICKED",
			fields: [ { 
				name: "Performer",
				value: `${execMember?.displayName ?? executor.username} (${executor.tag})`,
				inline: true
			}, { 
				name: "Target",
				value: `${targetMember?.displayName ?? target.username} (${target.tag})`,
				inline: true
			} ],
			timestamp: new Date( )
		} );

		if ( reason ) { 
			embed.fields.push( { 
				name: "Reason",
				value: reason
			} );
		}

		embed.setThumbnail( executor.displayAvatarURL( { 
			dynamic: true
		} ) );

		const km = messages.kicked;
		const result = km[ Math.floor( Math.random( ) * km.length ) ];

		const message = result
			.replace( "__E__", execMember )
			.replace( "__T__", targetMember )
			.replace( "__G__", guild.name );

		wc.send( message );
		uc.send( { embed } );
	}
	
	/**
	 * Initializes the guild ban message
	 * @param {Guild} guild
	 * @param {User} user
	 */
	async initBanned( guild, user ) { 
		const uc = guild.channels.cache.find( c => c.name === "update" );
		const wc = guild.channels.cache.find( c => c.name === "welcome" );

		const embed = new MessageEmbed( { 
			color: 0x964f4f,
			title: "BANNED",
			timestamp: new Date( )
		} );

		const logs = await guild.fetchAuditLogs( { 
			limit: 1,
			type: "MEMBER_BAN_ADD"
		} );

		const log = logs.entries.first( );

		if ( log ) { 
			const { executor, target, reason } = log;
			const executorMember = guild.member( executor );

			if ( target.id === user.id ) { 
				if ( reason ) embed.fields.push( { 
					name: "Reason",
					value: reason
				} );

				if ( executor ) { 
					embed.fields.push( { 
						name: "Performer",
						value: `${executorMember?.displayName ?? executor.username} (${executor.tag})`,
						inline: true
					} );

					embed.setThumbnail( executor.displayAvatarURL( { 
						dynamic: true
					} ) );
				}
			}
		}

		embed.fields.push( { 
			name: "Target",
			value: `${guild.member( user )?.displayName ?? user.username} (${user.tag})`,
			inline: true
		} );

		const bm = messages.banned;
		const result = bm[ Math.floor( Math.random( ) * bm.length ) ];

		const message = result
			.replace( "__U__", user )
			.replace( "__G__", guild.name );
		
		wc.send( message );
		return uc.send( { embed } );
	}

	/**
	 * Initializes the guild member update event
	 * @param {GuildMember} oldMember
	 * @param {GuildMember} newMember
	 */
	async initUpdate( oldMember, newMember ) { 
		if ( !oldMember.displayName ) return;

		if ( oldMember.displayName !== newMember.displayName ) { 
			return this.initNickChange( oldMember, newMember );
		}

		const oldRoles = oldMember.roles.cache;
		const newRoles = newMember.roles.cache;

		if ( oldRoles.size < newRoles.size ) { 
			const addedRoles = newRoles.difference( oldRoles );
			return this.initRolesAdded( newMember, addedRoles );
		}

		if ( oldRoles.size > newRoles.size ) { 
			const removedRoles = newRoles.difference( oldRoles );
			return this.initRolesRemoved( newMember, removedRoles );
		}
	}

	/**
	 * Initializes a nickname change
	 * @param {GuildMember} oldMember 
	 * @param {GuildMember} newMember 
	 */
	async initNickChange( oldMember, newMember ) { 
		const uc = newMember.guild.channels.cache.find( c => c.name === "update" );

		const embed = new MessageEmbed( { 
			color: 0xdf9a3f,
			title: "NICKNAME CHANGE",
			thumbnail: newMember.user.displayAvatarURL( { 
				dynamic: true
			} ),
			fields: [ { 
				name: "User tag",
				value: newMember.user.tag
			}, { 
				name: "Previous nickname",
				value: oldMember.displayName,
				inline: true
			}, { 
				name: "New nickname",
				value: newMember.displayName,
				inline: true
			} ],
			timestamp: new Date( )
		} );

		return uc.send( { embed } );
	}

	/**
	 * Initializes a role addition
	 * @param {GuildMember} member 
	 * @param {Collection<string, Role>} addedRoles
	 */
	async initRolesAdded( member, addedRoles ) { 
		const uc = member.guild.channels.cache.find( c => c.name === "update" );

		const embed = new MessageEmbed( { 
			title: "USER ROLE(S) ADDED",
			color: 0xdfffff,
			thumbnail: member.user.displayAvatarURL( { 
				dynamic: true
			} ),
			fields: [ { 
				name: "User tag",
				value: member.user.tag,
				inline: true
			}, { 
				name: "Added roles",
				value: addedRoles.map( role => role.name ).join( ", " ),
				inline: true
			} ],
			timestamp: new Date( )
		} );

		return uc.send( { embed } );
	}

	/**
	 * Initializes a role removal
	 * @param {GuildMember} member 
	 * @param {Collection<string, Role>} removedRoles
	 */
	async initRolesRemoved( member, removedRoles ) { 
		const uc = member.guild.channels.cache.find( c => c.name === "update" );

		const embed = new MessageEmbed( { 
			title: "USER ROLE(S) REMOVED",
			color: 0xaf0000,
			thumbnail: member.user.displayAvatarURL( { 
				dynamic: true
			} ),
			fields: [ { 
				name: "User tag",
				value: member.user.tag,
				inline: true
			}, { 
				name: "Removed roles",
				value: removedRoles.map( role => role.name ).join( ", " ),
				inline: true
			} ],
			timestamp: new Date( )
		} );

		return uc.send( { embed } );
	}

	async isActive( ) { 
		return new Promise( ( resolve, reject ) => { 
			( this.active ? resolve : reject )( );
		} );
	}

	async connect( ) { 
		return mongoose.connect( process.env.MONGO_URI, { 
			useNewUrlParser: true,
			useUnifiedTopology: true
		} );
	}

	async init( ) { 
		return this.login( process.env.PANTHERBOT_TOKEN );
	}
}