const { Command } = require( "discord.js-commando" );
const { words } = require( "@util/jumbo-words" );

const GAMES = { };

const STAGES = Object.freeze( { 
	BEGIN : ( counter ) => { 
		return `A new "Jumbo" game is starting in ${counter} seconds!`;
	},
	IN_GAME : ( word ) => { 
		let jumbledWord = "";

		const characters = [ ...word ];

		console.log( characters );

		const letterPattern = /[\w\d]/;

		const letters = characters.filter( letterPattern.test.bind( letterPattern ) );

		console.log( letters );

		for ( const letter of characters ) { 
			console.log( letter );

			if ( !letterPattern.test( letter ) ) { 
				jumbledWord += letter;
				jumbledWord += " ";
				continue;
			}

			const randomIndex = Math.floor( Math.random( ) * letter.length );
			const randomLetter = letters[ randomIndex ];

			console.log( randomLetter );

			jumbledWord += randomLetter;
			jumbledWord += " ";

			letters.splice( randomIndex, 1 );
		}

		jumbledWord = jumbledWord
			.toUpperCase( )
			.trim( );

		console.log( jumbledWord );

		return `The word is: **${jumbledWord}**!`;
	},
	END : ( points ) => { 
		const sorted = Object.keys( points ).sort( ( a, b ) => { 
			return points[ b ] - points[ a ];
		} );

		const highest = Math.max( ...sorted.map( x => points[ x ] ) );

		const results = [ ];

		for ( const key of sorted ) { 
			const amount = points[ key ];

			const percentage = `${Number( ( amount / highest ) * 100 ).toFixed( 2 )}`;

			const string = `<@${key}> has ${amount} point${amount === 1 ? "" : "s"} (${percentage})`;

			results.push( string );
		}

		return `This Jumbo game has now concluded. Here are the results: \n${results.join( "\n" )}`;
	}
} );

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

		if ( stage === "BEGIN" ) { 
			let string = STAGES[ stage ]( game.counter );
			message.edit( string );
			if ( game.counter < 1 ) { 
				game.stage = "IN_GAME";
				game.counter = 120;

				selectWord( game );

				string = STAGES[ game.stage ]( game.currentWord );
				message.edit( string );
			}
		} else if ( stage === "IN_GAME" ) {
			if ( game.counter < 1 ) { 
				game.stage = "END";

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

module.exports = class JumboGame extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "jumbo",
			group : "games",
			memberName : "jumbo",
			aliases : [ "j" ],
			description : "Starts a Jumbo game"
		} );

		bot.on( "message", message => { 
			const { channel, content, member } = message;
			const { id } = channel;

			const game = GAMES[ id ];

			if ( 
				game?.currentWord &&
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
						.reply( `You have received 1 point (${++points[ member.id ]} total)` )
						.then( msg => msg.delete( { timeout : 1000 * seconds} ) );
					
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
			.send( "Preparing a Jumbo game..." )
			.then( message => { 
				GAMES[ channel.id ] = { 
					message,
					stage : "BEGIN",
					counter : 5,
					remainingWords : [ ...words ],
					points : { }
				};
			} );
	}
}