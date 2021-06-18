const profileModel = require( "../../features/models/profileSchema" );
const { Message } = require( "discord.js" );
const { Command } = require( "discord.js-commando" );

module.exports = class BegCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "beg",
			memberName: "beg",
			description: "Begs the server for money.",
			group: "economy"
		} );
	}

	/**
	 * @param {Message} message
	 */
	async run( message ) { 
		const random = Math.floor( Math.random( ) * 750 ) + 1;
		
		await profileModel.findOneAndUpdate( { 
			userId: message.author.id
		}, { 
			$inc: { 
				balance: random
			}
		} );

		return message.channel.send( `You begged us for money, and you have received ${random} **nords**. Good day sir!` );
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