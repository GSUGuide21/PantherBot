const profileModel = require( "../../features/models/profileSchema" );
const { Message, MessageEmbed } = require( "discord.js" );
const { Command } = require( "discord.js-commando" );

module.exports = class BalanceCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "balance",
			memberName: "balance",
			group: "economy",
			description: "Shows the user's balance.",
			aliases: [ "bal", "bl" ]
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( message ) { 
		const { balance, bank } = await this.fetchData( message );

		const parsedBalance = Number( Math.abs( balance ) ).toLocaleString( "en-us" );
		const parsedBank = Number( Math.abs( bank ) ).toLocaleString( "en-US" );

		const embed = new MessageEmbed( { 
			title: "THE BANK OF NOTSOUTHERN",
			footer: { 
				text: message.member.displayName,
				iconURL: message.author.displayAvatarURL( { 
					dynamic: true 
				} )
			},
			fields: [ { 
				name: "Cash balance",
				value: `${balance < 0 ? `-N${parsedBalance}` : `N${parsedBalance}`}`
			}, { 
				name: "Bank balance",
				value: `${bank < 0 ? `-N${parsedBank}` : `N${parsedBank}`}`
			} ]
		} );

		return message.channel.send( { embed } );
	}

	/**
	 * @param {Message} message
	 */
	async fetchData( { author } ) { 
		return await profileModel.findOne( { 
			userId: author.id
		} );
	}
}