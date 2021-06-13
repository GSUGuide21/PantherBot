const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class PlayCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "play",
			memberName: "play",
			aliases: [ "game" ],
			description: "This command sets the activity for you."
		} );
	}

	/**
	 * @param {Message} message
	 * @param {string} game
	 */
	async run( { channel }, game ) { 
		if ( !game ) return channel.send( "A game is required! Please try again." );
		this.client.user.setActivity( game, { type: "PLAYING" } );
		return channel.send( `${this.client.user.username} is now playing ${game}!` );
	}
}