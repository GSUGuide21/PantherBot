const { MODERATORS } = require( "../../features/util/role-types" );
const profileModel = require( "../../features/models/profileSchema" );
const { Command } = require( "discord.js-commando" );
const { Message, GuildMember, Guild } = require( "discord.js" );

module.exports = class GiveMoneyCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "give-money",
			memberName: "give-money",
			description: "Gives money to a member.",
			group: "economy"
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( { member, guild, channel, mentions }, text ) { 
		const isModerator = await this.isModerator( member, guild );
		if ( !isModerator ) return channel.send( `${member}, you do not have the permissions to give money.` );

		const target = mentions.users.first( );

		console.log( target );
		
		const pattern = /^<@!?(?:\d+)>$/g;

		const money = text.replace( pattern, "" ).trim( );
		let [ amount ] = money.split( /\s+/g );

		const MAX_AMOUNT = 1_000_000_000;
		const MIN_AMOUNT = 0.01;

		amount = ( !isNaN( amount ) && isFinite( amount ) ) ? Number( amount ) : MIN_AMOUNT;
		amount = Math.max( MIN_AMOUNT, Math.min( amount, MAX_AMOUNT ) );

		await profileModel.findOneAndUpdate( { 
			userId: target.id
		}, { 
			$inc: { 
				balance: amount
			}
		} );
	}
	
	/**
	 * @param {GuildMember} member
	 * @param {Guild} guild
	 */
	async isModerator( member, guild ) { 
		return MODERATORS.some( group => { 
			const lowercaseGroup = group.toLowerCase( );
			const role = guild.roles.cache.find( 
				r => r.name.toLowerCase( ) === lowercaseGroup
			);
			return role && member.roles.cache.has( role.id );
		} );
	}
}