const { MessageEmbed, GuildMember, Role, User, Guild, Collection, GuildChannel, Message, MessageButton, MessageActionRow, Interaction, ButtonInteraction } = require( "discord.js" );
const { Client } = require( "discord.js-commando" );
const path = require( "path" );
const fs = require( "fs-extra" );
const Package = require( "../package.json" );

const messages = require( "./features/messages.json" );
const responses = require( "./features/responses/data.json" );
const responseHandlers = require( "./features/responses/respond" );

const mongoose = require( "mongoose" );
const profileModel = require( "./features/models/profileSchema" );

const filterEmojis = string => { 
	const allowedChars = Object.freeze( [ 
		"a-z", "0-9", "\\s", "\\-", "_",
		"\\&", "\\$", "\\#", "\\!", "\\(",
		"\\)", "\\[", "\\]"
	] );
	const pattern = new RegExp( `[^${allowedChars.join( "" )}]`, "gi" );
	return string.replace( pattern, "" ).trim( );
};

module.exports = class PantherBotClient extends Client { 
	constructor( opts = { } ) { 
		opts.name = "PantherBot";
		opts.owner = "707779366318243840";
		opts.commandPrefix = "$";

		super( opts );

		this.ACTIVE = true;
		this.POLL_LIMIT = 20;
		this.IS_AFK = false;

		this.log( this );
	}

	#defaultProfileObj = Object.freeze( { 
		balance: 0,
		bank: 0,
		muted: false,
		muteExpiry: 0
	} );

	get isActive( ) { 
		return new Promise( ( resolve, reject ) => ( this.active ? resolve : reject )( this.active ) );
	}

	toggle = msg => { 
		this.ACTIVE = !this.ACTIVE;
		if ( msg ) this.log( msg );
	};

	log = msg => console.log( `PantherBot Log: ${msg}` );
	warn = msg => console.log( `PantherBot Warning: ${msg}` );
	error = msg => console.log( `PantherBot Error: ${msg}` );

	getChannelName = name => filterEmojis( name ).toLowerCase( ).replace( /\s+/g, " " ).trim( );

	/**
	 * @param {string|RegExp} name 
	 * @param {Guild} guild 
	 * @returns {GuildChannel}
	 */
	getChannel = ( name, guild ) => guild.channels.cache.find( channel => { 
		const isPattern = RegExp.prototype.isPrototypeOf( name );
		const target = this.getChannelName( channel.name );
		return ( isPattern ? name.test( target ) : target === name );
	} );

	/**
	 * @param {Guild} guild 
	 */
	getUpdateChannel = guild => this.getChannel( "update", guild );

	/**
	 * @param {Guild} guild
	 */
	getWelcomeChannel = guild => this.getChannel( "welcome", guild );

	/**
	 * @param {string} game
	 */
	setGame = game => this.user.setPresence( { 
		status: "online",
		activities: [ { name: game, type: "PLAYING" } ]
	} );

	/**
	 * @param {string} music
	 */
	setMusic = music => this.user.setPresence( { 
		status: "online",
		activities: [ { name: music, type: "LISTENING" } ]
	} );

	toggleAFK = ( ) => this.user.setPresence( { 
		afk: ( this.IS_AFK = !this.IS_AFK )
	} );

	connect = async ( ) => mongoose.connect( process.env.MONGO_URI, { 
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false
	} );

	wait = async timeout => { 
		return new Promise( resolve => setTimeout( resolve, timeout ) );
	};

	sleep = this.wait;

	/**
	 * @typedef {Object} RandomMessageOptions
	 * @property {string[]} messages
	 * @property {RandomMessageData} data
	 */

	/**
	 * @typedef {Object} RandomMessageData
	 * @property {GuildMember} member
	 * @property {User} target
	 * @property {Guild} guild
	 * @property {User} executor
	 * @property {User} author
	 * @property {PantherBotClient} client
	 * @property {GuildChannel} channel
	 */

	/**
	 * Parses a random message from an event
	 * @param {RandomMessageOptions} options
	 */
	parseRandomMessage = ( { messages = [ ], data } ) => { 
		const randomIndex = Math.floor( Math.random( ) * messages.length );
		const message = messages[ randomIndex ];
		const { member, executor, target, author, channel, guild, client } = data;

		const result = message
			.replace( /\$M\$/g, `${member}` )
			.replace( /\$A\$/g, `${author}` )
			.replace( /\$U\$/g, `${member.user}` )
			.replace( /\$G\$/g, `${guild.name}` )
			.replace( /\$C\$/g, `${channel.name}` )
			.replace( /\$T\$/g, `${member.user.tag}` )
			.replace( /\$E\$/g, `${executor.user.tag}` )
			.replace( /\$X\$/g, `${target.tag}` )
			.replace( /\$O\$/g, `${client.owners[ 0 ].tag}` );

		return result;
	};
	
	init = async ( ) => { 
		this.once( "ready", this.initCommands.bind( this ) );
		this.initFeatures( );
		return this.login( process.env.PANTHERBOT_TOKEN );
	};

	initFeatures = ( ) => { 
		this.on( "message", this.initMessage.bind( this ) );
		this.on( "guildMemberAdd", this.initJoin.bind( this ) );
		this.on( "guildMemberRemove", this.initRemove.bind( this ) );
		this.on( "guildBanAdd", this.initBanned.bind( this ) );
		this.on( "guildMemberUpdate", this.initUpdate.bind( this ) );
	};

	/**
	 * Initializes all messages
	 * @param {Message} message
	 */
	initMessage = async message => { 
		const { author: { bot } } = message;
		if ( bot ) return;
		this.initResponses( message );
		this.initFilter( message );
	};

	/**
	 * @param {Message} message
	 */
	initFilter = async message => { 
		const {
			author,
			content,
			member,
		} = message;

		const filter = require( "./features/filter/data.json" );
		const props = Object.getOwnPropertyNames( filter );

		const prop = props.find( p => { 
			const { pattern, exactMatch = true, flags = "i" } = filter[ p ];
			const regex = new RegExp( `${exactMatch ? `^${pattern}$` : pattern}`, flags );
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
	};

	initResponses = async message => { 
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

		if ( responseHandlers?.[ key ] && typeof responseHandlers[ key ] === "function" )
			return responseHandlers[ key ]( message, this );

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

		text = this.parseRandomMessage( { 
			messages: [ message ],
			data: { member, guild, author, channel, client: this }
		} );

		return channel.send( text );
	};

	initCommands = async ( ) => { 
		this.log( "Initialization completed. Loading commands for PantherBot now." );
		this.setGame( "PantherBot" );

		this.log( `PantherBot version: ${Package.version}.` );

		const groups = require( "./groups.json" );
		this.registry.registerGroups( Object.entries( groups ) )
			.registerDefaults( )
			.registerCommandsIn( path.join( __dirname, "commands" ) );
		
		this.connect( );
	};

	/**
	 * Initializes the guild join message
	 * @param {GuildMember} member 
	 */
	initJoin = async member => { 
		const embed = new MessageEmbed( { 
			color: 0x3444cf,
			timestamp: new Date( ),
			title: "JOINED",
			fields: [ { 
				name: "USERNAME",
				value: member.user.tag
			} ],
			thumbnail: member.user.displayAvatarURL( { 
				dynamic: true
			} )
		} );

		const uc = this.getUpdateChannel( member.guild );
		const wc = this.getWelcomeChannel( member.guild );

		const result = this.parseRandomMessage( { 
			messages: messages.welcome,
			member
		} );

		wc.send( result );

		return uc.send( { embeds: [ embed ] } );
	};

	/**
	 * Initializes the profile for the guild's member
	 * @param {GuildMember} member
	 */
	initProfile = async member => { 
		const profile = await profileModel.create( { 
			userId: member.id,
			guildId: member.guild.id,
			...this.#defaultProfileObj
		} );

		profile.save( );
	};

	/**
	 * Initializes the profile for the guild's member from a message
	 * @param {Message} message
	 */
	initProfileFromMessage = async message => { 
		const profile = await profileModel.create( { 
			userId: member.author.id,
			guildId: message.guild.id,
			...this.#defaultProfileObj
		} );

		profile.save( );
	};

	/**
	 * Fetches the kick logs
	 * @param {Guild} guild
	 * @param {number} limit
	 */
	getKickLogs = async ( guild, limit = 1 ) => { 
		return await guild.fetchAuditLogs( { 
			type: "MEMBER_KICK",
			limit
		} );
	};

	/**
	 * Fetches the kick logs
	 * @param {Guild} guild
	 * @param {number} limit
	 */
	getBanLogs = async ( guild, limit = 1 ) => { 
		return await guild.fetchAuditLogs( { 
			type: "MEMBER_BAN_ADD",
			limit
		} );
	};

	/**
	 * Initializes the guild remove message
	 * @param {GuildMember} member 
	 */
	initRemove = async member => { 
		const kickLogs = await this.getKickLogs( member.guild, 1 );
		const banLogs = await this.getBanLogs( member.guild, 1 );

		const currentDate = Date.now( );
		const delay = 1500;

		const kickLog = kickLogs.entries.first( );
		const banLog = banLogs.entries.first( );

		const { guild } = member;

		if ( kickLog ) { 
			const { executor, target, createdTimestamp, reason } = kickLog;
			const execMember = await guild.members.fetch( { user: executor } );
			const targetMember = await guild.members.fetch( { user: target } );

			const diff = currentDate - createdTimestamp;
			if ( ( member.user.id === target.id ) && ( diff < delay ) ) {
				return this.initKicked( { 
					executorMember: execMember,
					targetMember,
					guild,
					reason,
					executor,
					targer
				} );
			}
		}

		if ( banLog ) { 
			const { target, createdTimestamp } = kickLog;
			const diff = currentDate - createdTimestamp;
			if ( ( member.user.id === target.id ) && ( diff < delay ) ) return;
		}

		return this.initLeft( member );
	};

	/**
	 * Initializes the guild leave message
	 * @param {GuildMember} member
	 */
	initLeft = async member => { 
		const uc = this.getUpdateChannel( member.guild );
		const wc = this.getWelcomeChannel( member.guild );

		const result = this.parseRandomMessage( {
			messages: messages.left, 
			data: { member }
		} );

		const embed = new MessageEmbed( { 
			color: 0x56afff,
			title: "LEFT",
			timestamp: new Date( ),
			fields: [ { 
				name: "User",
				value: `${member?.displayName ?? member?.user?.username}`,
				inline: true
			} ]
		} );

		wc.send( result );

		return uc.send( { embeds: [ embed ] } );
	};
	
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
	initKicked = async ( { executor, target, guild, executorMember, targetMember, reason } ) => { 
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
			thumbnail: executor.displayAvatarURL( { dynamic: true } ),
			timestamp: new Date( )
		} );

		if ( reason ) embed.fields.push( { 
			name: "Reason",
			value: reason
		} );

		const result = this.parseRandomMessage( { 
			messages: messages.kicked,
			data: { executor, target, guild }
		} );

		wc.send( result );
		uc.send( { embeds: [ embed ] } );
	};

	/**
	 * Initializes the guild ban message
	 * @param {Guild} guild
	 * @param {User} user
	 */
	initBanned = async ( guild, user ) => { 
		const uc = this.getUpdateChannel( guild );
		const wc = this.getWelcomeChannel( guild );

		const banLogs = await this.getBanLogs( guild );
		const banLog = banLogs.entries.first( );

		checkBanLog: if ( banLog ) { 
			const { executor, target, reason } = banLog;
			const executorMember = await guild.members.fetch( { user: executor } );
			const targetMember = await guild.members.fetch( { user: target } );

			if ( target.id !== user.id ) break checkBanLog;

			if ( reason ) embed.fields.push( { 
				name: "Reason",
				value: reason
			} );

			const embed = new MessageEmbed( { 
				color: 0x964f4f,
				title: "BANNED",
				timestamp: new Date( ),
				fields: [ { 
					name: "Performer",
					value: `${executorMember?.displayName ?? executor.username} (${executor.tag})`,
					inline: true
				}, { 
					name: "Target",
					value: `${targetMember?.displayName ?? target.username} (${target.tag})`,
					inline: true
				} ],
				thumbnail: executor.displayAvatarURL( { dynamic: true } )
			} );

			const result = this.parseRandomMessage( { 
				messages: messages.banned,
				data: { executor, target, guild }
			} );

			wc.send( result );
			uc.send( { embeds: [ embed ] } );
		}
	};

	/**
	 * Initializes the guild member update event
	 * @param {GuildMember} oldMember
	 * @param {GuildMember} newMember
	 */
	initUpdate = async ( oldMember, newMember ) => { 
		if ( !oldMember.displayName ) return;
		
		if ( oldMember.displayName !== newMember.displayName ) return this.initNickChange( oldMember, newMember );

		const oldRoles = oldMember.roles.cache, newRoles = newMember.roles.cache;

		if ( oldRoles.size < newRoles.size ) { 
			const addedRoles = newRoles.difference( oldRoles );
			return this.initRolesAdded( newMember, addedRoles );
		}

		if ( oldRoles.size > newRoles.size ) { 
			const removedRoles = newRoles.difference( oldRoles );
			return this.initRolesRemoved( newMember, removedRoles );
		}
	};

	/**
	 * Initializes a nickname change
	 * @param {GuildMember} oldMember 
	 * @param {GuildMember} newMember 
	 */
	initNickChange = async ( oldMember, newMember ) => { 
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

		return uc.send( { embeds: [ embed ] } );
	};

	/**
	 * Initializes a role addition
	 * @param {GuildMember} member 
	 * @param {Collection<string, Role>} addedRoles
	 */
	initRolesAdded = async ( member, addedRoles ) => { 
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
	initRolesAdded = async ( member, addedRoles ) => { 
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

		return uc.send( { embeds: [ embed ] } );
	};

	/**
	 * Initializes a role removal
	 * @param {GuildMember} member 
	 * @param {Collection<string, Role>} removedRoles
	 */
	initRolesRemoved = async ( member, removedRoles ) => { 
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
	};
}