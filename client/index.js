const { MessageEmbed, GuildMember, User, Guild, Collection, Role, GuildChannel, Message } = require( "discord.js" );
const { Client } = require( "discord.js-commando" );
const DiscordButton = require( "discord-buttons" );
const path = require( "path" );
const fs = require( "fs-extra" );

const messages = require( "./features/messages.json" );
const responses = require( "./features/responses/data.json" );
const responseCallbacks = require( "./features/responses/respond" );

const mongoose = require( "mongoose" );
const profileModel = require( "./features/models/profileSchema" );

const filterEmojis = string => { 
	const allowedChars = Object.freeze( [ 
		"a-z", "0-9", "\\s", "\\-", "_",
		"\\&", "\\$", "\\#", "\\!", "\\(",
		"\\)", "\\[", "\\]"
	] );
	const pattern = new RegExp( "[^" + allowedChars.join( "" ) + "]", "gi" );
	return string.replace( pattern, "" ).trim( );
};

module.exports = class PantherBotClient extends Client {
	constructor( opts = { } ) { 
		opts.name = "PantherBot";
		opts.owner = "707779366318243840";
		opts.commandPrefix = "$";

		super( opts );

		this.active = true;
		this.pollLimit = 16;
		this.afk = false;

		this.log( this );
		DiscordButton( this );
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

	getChannelName( name ) { 
		return filterEmojis( name )
			.toLowerCase( )
			.replace( /\s+/g, " " )
			.trim( );
	}

	/**
	 * @param {string|RegExp} name 
	 * @param {Guild} guild 
	 * @returns 
	 */
	getChannel( name, guild ) { 
		return guild.channels.cache.find( c => { 
			const isPattern = Object( name ) instanceof RegExp;
			const channelName = this.getChannelName( c.name );
			return isPattern ? name.test( channelName ) : channelName === String( name );
		} );
	}

	/**
	 * @param {Guild} guild 
	 */
	getUpdateChannel( guild ) { 
		return this.getChannel( "update", guild );
	}

	/**
	 * @param {Guild} guild 
	 */
	getWelcomeChannel( guild ) { 
		return this.getChannel( "welcome", guild );
	}

	// Shorthand activity functions
	setGame( game ) { 
		return this.user.setPresence( { 
			status: "online",
			activity: { 
				name: game, 
				type: "PLAYING" 
			} 
		} );
	}

	setMusic( music ) { 
		return this.user.setPresence( { 
			status: "online",
			activity: { 
				name: music,
				type: "LISTENING"
			}
		} );
	}

	toggleAFK( ) { 
		const afk = this.afk;
		return this.user.setPresence( { 
			afk: ( this.afk = !afk )
		} );
	}

	async initFeatures( ) { 
		this.once( "ready", this.initCommands.bind( this ) );
		this.initMessages( );
	}

	async initMessages( ) { 
		this.on( "message", this.initMessageSent.bind( this ) );
		this.on( "guildMemberAdd", this.initJoin.bind( this ) );
		this.on( "guildMemberRemove", this.initRemove.bind( this ) );
		this.on( "guildBanAdd", this.initBanned.bind( this ) );
		this.on( "guildMemberUpdate", this.initUpdate.bind( this ) );
	}

	/**
	 * @param {Message} message
	 */
	async initMessageSent( message ) { 
		const { author } = message;
		if ( author.bot ) return;
		this.initResponses( message );
		this.initFilter( message );
	}

	/**
	 * @param {Message} message
	 */
	async initFilter( message ) { 
		const { 
			author,
			content,
			member,
			guild,
			channel
		} = message;

		const filter = require( "./features/filter/data.json" );

		const properties = Object.getOwnPropertyNames( filter );

		const prop = properties.find( p => { 
			const { pattern, matchExact = true, flags = "i" } = filter[ p ];

			const regex = new RegExp( `${ matchExact ? `^${pattern}$` : `${pattern}` }`, flags );
			return regex.test( content );
		} );

		if ( !prop ) return false;

		const f = filter[ prop ];

		const { 
			pattern,
			action,
			matchExact = true,
			flags = "i"
		} = f;

		const r = new RegExp( `${ matchExact ? `^${pattern}$` : `${pattern}` }`, flags );
		const [ match ] = r.exec( content );

		const reason = `${member.displayName} has been found playing foul with our filter system. Word/phrase found: ${match}`;

		switch ( action ) { 
			case ( "warn" ): { 
				try { 
					const data = await profileModel.findOne( { 
						userId: author.id
					} );

					if ( !data ) break;

					const { warnings } = data;

					if ( warnings === 2 ) { 
						await member.kick( { reason } );

						await profileModel.findOneAndUpdate( { 
							userId: author.id
						}, { 
							$inc: { 
								warnings: 1
							}
						} );
					} else if ( warnings === 3 ) { 
						await member.ban( { reason } );

						await profileModel.findOneAndRemove( { 
							userId: author.id
						} );
					} else { 
						await profileModel.findOneAndUpdate( { 
							userId: author.id
						}, { 
							$inc: { 
								warnings: 1
							}
						} );

						return message.reply( `Warning ${warnings + 1}: you have been found playing foul with our filter system. Word/phrase found: ${match}` );
					}
				} catch ( e ) { 
					console.log( e );
				} finally { 
					break;
				}
			}

			case ( "kick" ): { 
				return await member.kick( reason );
			}

			case ( "ban" ): { 
				return await member.ban( reason );
			}

			default: { 
				console.log( match );
			}
		}
	}

	/**
	 * @param {Message} message 
	 */
	async initResponses( message ) {
		const { 
			author,
			content,
			member,
			guild,
			channel
		} = message;

		try { 
			const data = await profileModel.findOne( { 
				userId: author.id
			} );

			if ( !data ) this.initProfileFromMessage( message );
		} catch ( err ) { 
			console.log( err );
		}

		const key = Object.getOwnPropertyNames( responses ).find( k => { 
			const { pattern, matchExact = true, flags = "i" } = responses[ k ];

			const regex = new RegExp( `${ matchExact ? `^${pattern}$` : `${pattern}` }`, flags );
			return regex.test( content );
		} );

		if ( !key ) return;

		if ( responseCallbacks?.[ key ] && typeof responseCallbacks[ key ] === "function" )
			return responseCallbacks[ key ]( message, this );

		const response = responses[ key ];

		const { 
			prep = { },
			respond
		} = response;

		let text = respond;

		if ( Object.getOwnPropertyNames( prep ).length ) { 
			for ( const prop of Object.getOwnPropertyNames( prep ) ) { 
				const url = path.join( __dirname, prep[ prop ] );
				const data = await fs.readFile( url, "utf-8" );
				const p = new RegExp( `\\$${prop}\\$`, "gi" );

				text = text.replace( p, data );
			}
		}

		text = text
			.replace( /\$M\$/g, member )
			.replace( /\$G\$/g, guild.name )
			.replace( /\$U\$/g, author )
			.replace( /\$C\$/g, channel.name )
			.replace( /\$O\$/g, this.owners[ 0 ].tag );

		return channel.send( text );
	}

	async initCommands( ) { 
		this.log( "Initialization completed. Loading commands now." );
		this.setGame( "PantherBot" );

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

		const uc = this.getUpdateChannel( member.guild );
		const wc = this.getWelcomeChannel( member.guild );

		const wm = messages.welcome;
		const message = wm[ Math.floor( Math.random( ) * wm.length ) ];

		const result = message
			.replace( /\$(?:M|U)\$/g, member )
			.replace( /\$G\$/g, member.guild.name );
		
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
	 * Initializes the profile for our member
	 * @param {GuildMember} member 
	 */
	async initProfile( member ) { 
		const profile = await profileModel.create( { 
			userId: member.id,
			guildId: member.guild.id,
			balance: 0,
			bank: 0
		} );

		profile.save( );
	}

	/**
	 * Initializes the profile for our member 
	 * from a message.
	 * @param {Message} message
	 */
	 async initProfileFromMessage( message ) { 
		const profile = await profileModel.create( { 
			userId: message.author.id,
			guildId: message.guild.id,
			balance: 0,
			bank: 0
		} );

		profile.save( );
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
		const uc = this.getUpdateChannel( member.guild );
		const wc = this.getWelcomeChannel( member.guild );

		const lm = messages.left;
		const result = lm[ Math.floor( Math.random( ) * lm.length ) ];
		
		const message = result
			.replace( /\$(?:M|U)\$/g, member.user.tag )
			.replace( /\$G\$/g, member.guild.name );
		
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
		const uc = this.getUpdateChannel( guild );
		const wc = this.getWelcomeChannel( guild );

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
			.replace( /\$(?:E|U)\$/g, execMember.user.tag )
			.replace( /\$T\$/g, targetMember.user.tag )
			.replace( /\$G\$/g, guild.name );

		wc.send( message );
		uc.send( { embed } );
	}
	
	/**
	 * Initializes the guild ban message
	 * @param {Guild} guild
	 * @param {User} user
	 */
	async initBanned( guild, user ) { 
		const uc = this.getUpdateChannel( guild );
		const wc = this.getWelcomeChannel( guild );

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
		let executorMember = { };

		if ( log ) { 
			const { executor, target, reason } = log;
			executorMember = guild.member( executor );

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
			.replace( /\$T\$/g, user.tag )
			.replace( /\$(?:E|U)\$/g, executorMember?.user?.tag || "Unknown" )
			.replace( /\$G\$/g, guild.name );
		
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
		const uc = this.getUpdateChannel( newMember.guild );

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
		const uc = this.getUpdateChannel( member.guild );

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
				name: "Added role(s)",
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
		const uc = this.getUpdateChannel( member.guild );

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
				name: "Removed role(s)",
				value: removedRoles.map( role => role.name ).join( ", " ),
				inline: true
			} ],
			timestamp: new Date( )
		} );

		return uc.send( { embed } );
	}

	async isActive( ) { 
		return new Promise( ( resolve, reject ) => { 
			( this.active ? resolve : reject )( this.active );
		} );
	}

	async connect( ) { 
		return mongoose.connect( process.env.MONGO_URI, { 
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		} );
	}

	async init( ) { 
		return this.login( process.env.PANTHERBOT_TOKEN );
	}
}