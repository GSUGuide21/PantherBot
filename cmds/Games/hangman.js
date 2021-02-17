const { Command } = require( "discord.js-commando" );
const { topics } = require( "@util/hangman-topics" );

const isLetter = ( string = "" ) => string.length === 1 && /[\w]/.test( string );

const GAMES = { };

const STAGES = Object.freeze( { 
	BEGIN : ( counter ) => { 
		return `A new "Hangman" game is stating in ${counter} seconds!`;
	},
	IN_GAME : ( selectedLetters = [ ], phrase, topic ) => { 
		const characters = [ ...phrase ];
		const result = [ ];
		const selectedLettersUniq = selectedLetters.filter( ( value, index, array ) => { 
			return array.indexOf( value ) === index;
		} );
		const letters = characters.filter( isLetter );
		const lettersUniq = letters.filter( ( value, index, array ) => { 
			return array.indexOf( value ) === index;
		} );

		for ( const letter of characters ) { 
			if ( 
				!isLetter ||
				selectedLettersUniq.includes( letter )
			) {
				result.push( letter );
				continue;
			}

			result.push( "_" );
		}

		const lettersLeft = lettersUniq.length - selectedLettersUniq.length;

		return `Topic: ${topic}\n**${result.join( " " )}**\nLetters remaining: ${lettersLeft}`;
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

const selectPhrase = ( game ) => {
	const topicArray = Object.keys( topics ); 

	const topicArrayLC = topicArray.map( topic => topic.toLowerCase( ) );

	console.log( topics, topicArray );

	if ( 
		!topicArrayLC.includes( game.topic.toLowerCase( ) ) ||
		game?.randomTopic === true
	) {
		const randomIndex = Math.floor( Math.random( ) * topicArray.length );
		game.topic = topicArray[ randomIndex ];

		console.log( game );

		game.remainingPhrases = topicArray.reduce( ( accumulator, key ) => { 
			const length = topics[ key ].length;
			return accumulator + length;
		}, 0 );
	} else {
		const topic = topicArray.find( t => { 
			return t.toLowerCase( ) === game.topic.toLowerCase( );
		} );

		game.topic = topic;

		game.remainingPhrases = topics[ game.topic ].length;
	}

	const phrases = topics[ game.topic ].filter( p => { 
		return game.completedPhrases.includes( p ) === false;
	} );

	const randomPhraseIndex = Math.floor( Math.random( ) * phrases.length );

	const { phrase, points } = phrases[ randomPhraseIndex ];

	game.completedPhrases.push( phrase );

	game.currentPhrase = phrase;

	game.currentAccumulatedPoints = parseInt( points );
};

const gameLoop = ( ) => { 
	for ( const key in GAMES ) { 
		const game = GAMES[ key ];
		const { message, stage, topic } = game;

		if ( stage === "BEGIN" ) {
			let string = STAGES[ stage ]( game.counter );
			message.edit( string );

			if ( game.counter < 1 ) { 
				game.stage = "IN_GAME";
				game.counter = 75;

				selectPhrase( game, topic );

				string = STAGES[ game.stage ]( [ ], game.currentPhrase, game.topic );
				message.edit( string );
			}
		} else if ( stage === "IN_GAME" ) {
			if ( 
				game.counter < 1 ||
				game.remainingPhrases === 0
			) {
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

module.exports = class HangmanGame extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "hangman",
			memberName : "hangman",
			aliases : [ "h" ],
			group : "games",
			description : "Initializes the Hangman game"
		} );

		bot.on( "message", message => { 
			const { channel, content, member } = message;
			const { id } = channel;

			const game = GAMES[ id ];

			if ( 
				game?.currentPhrase &&
				!member.user.bot
			) {
				message.delete( );

				if ( game.stage === "IN_GAME" ) {
					const { points, topic, currentAccumulatedPoints, currentPhrase, selectedLetters, remainingLetters, stage } = game;
					const seconds = 2;

					if ( 
						content.toLowerCase( ).length > 1 && 
						content.toLowerCase( ) === currentPhrase.toLowerCase( ) 
					) {
						points[ member.id ] = points[ member.id ] || 0;

						const accumulatedPoints = currentAccumulatedPoints + points;
						points[ member.id ] = accumulatedPoints;

						message
							.reply( `You have received ${currentAccumulatedPoints} point${currentAccumulatedPoints === 1 ? "" : "s"} (${points[ member.id ]} total)` )
							.then( msg => msg.delete( { timeout : 1000 * seconds } ) );

						setTimeout( ( ) => { 
							if ( stage === "IN_GAME" ) {
								selectPhrase( game, topic );

								const string = STAGES[ game.stage ]( [ ], game.currentPhrase, game.topic );
								game.message.edit( string );
							}
						}, 1000 * seconds );

						return;
					}
					
					const letter = content.toUpperCase( );

					points[ member.id ] = points[ member.id ] || 0;

					if ( selectedLetters.includes( letter ) ) {
						return message
							.reply( `The letter (${letter}) has already been selected. Please choose another letter!` )
							.then( msg => msg.delete( { timeout : 1000 * seconds } ) );
					}

					const selectedIndex = remainingLetters.indexOf( letter );

					game.remainingLetters.splice( selectedIndex, 1 );

					game.selectedLetters.push( letter );

					const string = STAGES[ stage ]( game.selectedLetters, currentPhrase, topic );
					game.message.edit( string );
				}
			}
		} );

		gameLoop( );
	}

	async run( msg, topic = "" ) { 
		const { channel } = msg;
		msg.delete( );

		channel
			.send( "Preparing a Hangman game..." )
			.then( message => { 
				GAMES[ channel.id ] = { 
					message,
					stage : "BEGIN",
					counter : 5,
					completedPhrases : [ ],
					remainingPhrases : 0,
					topic,
					points : { }
				};
			} );
	}
}