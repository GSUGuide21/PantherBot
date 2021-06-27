const { Command } = require( "discord.js-commando" );
const { FastTypeController } = require( "../../features/games/fast-type" );

const FastType = new FastTypeController( );

module.exports = class FastTypeCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "fasttype",
			group: "games",
			memberName: "fasttype",
			aliases: [ "fast-type" ],
			description: "Initializes a Fast Type game"
		} );

		bot.on( "message", message => { 
			const { channel, content, member, author } = message;
			const { id } = channel;

			const game = FastType.games.get( id );

			if ( game?.currentWord && !author.bot ) { 
				message.delete( );

				if ( 
					content.toLowerCase( ) === game.currentWord.toLowerCase( ) &&
					game.stage === "IN_GAME"
				) game.givePoint( member, message );
			}
			
			FastType.loop( );
		} );
	}

	async run( msg ) { 
		FastType.addGame( msg, { 
			stage: "STARTING",
			points: { }
		} );
	}
};