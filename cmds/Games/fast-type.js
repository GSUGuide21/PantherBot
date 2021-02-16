const { Command } = require( "discord.js-commando" );
const { words } = require( "@util/fast-type-words" );

const EXAMPLE = Object.freeze( { 
	channelId : {
		message : "message object",
		stage : "string",
		counter : "number",
		currentWord : "string",
		remainingWords : [ "words here" ],
		points : { 
			userId : "points"
		}
	}
} );

const GAMES = { };

const STAGES = { 
	STARTING : ( counter ) => { 
		return `A new "Fast Type" game is starting in ${counter} seconds!`;
	},
	IN_GAME : ( word ) => { 
		let spacedWord = "";

		for ( const letter of [ ...word ] ) { 
			spacedWord += letter;
			spacedWord += " ";
		}

		return `The word is ***${spacedWord}***!`;
	},
	ENDING : ( points ) => { 
		const sorted = Object.keys( points ).sort( ( a, b ) => { 
			return points[ b ] - points[ a ];
		} );

		let results = "";

		for ( const key of sorted ) { 
			const amount = points[ key ];
			results += `<@${key}> has ${amount} point${amount === 1 ? "" : "s" }\n`
		}

		return `The game has now concluded. Here are the results: ${results}------`;
	}
};

const selectWord = game => { 
	const { remainingWords } = game;
	const randomIndex = Math.floor( Math.random( ) * remainingWords.length );

	game.currentWord = remainingWords[ randomIndex ];
	const currentIndex = remainingWords.indexOf( game.currentWord );
	game.remainingWords.splice( currentIndex, 1 );
};

const gameLoop = ( ) => { 
	for ( const key in GAMES ) { 
		const game = GAMES[ key ];
		const { message, stage } = game;

		if ( stage === "STARTING" ) { 
			let string = STAGES[ stage ]( game.counter );
			message.edit( string );
			if ( game.counter < 1 ) { 
				game.stage = "IN_GAME";
				game.counter = 30;

				selectWord( game );

				string = STAGES[ game.stage ]( game.currentWord );
				message.edit( string );
			}
			break;
		} else if ( stage === "IN_GAME" ) {
			if ( game.counter < 1 ) { 
				game.stage = "ENDING";

				const string = STAGES[ game.stage ]( game.points );
				message.edit( string );
				
				delete GAMES[ key ];

				continue;
			}
		}

		--game.counter;
	}
	setTimeout( gameLoop, 1000 );
};

module.exports = class FastTypeGame extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "fasttype",
			group : "games",
			memberName : "fasttype",
			aliases : [ "fast-type" ],
			description : "Starts a fast type game"
		} );

		bot.on( "message", message => { 
			const { channel, content, member } = message;
			const { id } = channel;

			const game = GAMES[ id ];
			
			if ( 
				game && 
				game.currentWord && 
				!member.user.bot 
			) { 
				message.delete( );

				if ( 
					game.stage === "IN_GAME" && 
					content.toLowerCase( ) === game.currentWord.toLowerCase( ) 
				) {
					game.currentWord = null;
					const seconds = 2;

					const { points } = game;
					points[ member.id ] = points[ member.id ] || 0;

					message
						.reply( `You have received 1 point (${++points[member.id]} total)` )
						.then( msg => msg.delete( { timeout : 1000 * seconds } ) );
					
					setTimeout( ( ) => { 
						if ( game.stage === "IN_GAME" ) { 
							selectWord( game );

							const string = STAGES[ game.stage ]( game.currentWord );
							game.message.edit( string );
						}
					}, 1000 * seconds );
				}
			}
		} );

		gameLoop( );
	}

	async run( msg ) { 
		const { channel } = msg;
		msg.delete( );
		channel
			.send( "Preparing game...")
			.then( message => { 
				GAMES[ channel.id ] = { 
					message,
					stage : "STARTING",
					counter : 5,
					remainingWords : [ ...words ],
					points : { }
				}
			} );
	}
}