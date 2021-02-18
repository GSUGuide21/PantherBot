const { Command } = require( "discord.js-commando" );
const { topics } = require( "@util/hangman-topics" );

const getTopic = ( name ) => { 
	const topicName = name.toLowerCase( );

	const topicArray = Object.keys( topics );

	if ( topicArray.includes( topicName ) ) {
		return topicName;
	}

	for ( const topic of topicArray ) { 
		const { aliases = [ ] } = topics[ topic ];
		if ( aliases.includes( topicName ) ) {
			return topic;
		}
	}

	const randomIndex = Math.floor( Math.random( )  * topicArray );

	const randomTopic = topicArray[ randomIndex ];

	return randomTopic;
};

const isLetter = s => s.length === 1 && /[A-Z]/i.test( s );

const GAMES = { };

const STAGES = Object.freeze( { 
	BEGIN : counter => `A new Hangman game is starting in ${counter} seconds!`,
	IN_GAME : game => { 
		const result = [ ];

		const { 
			selectedLetters = [ ], 
			triesLeft, 
			topicName,
			currentPhrase
		} = game;

		const characters = [ ...currentPhrase ].map( c => c.toUpperCase( ) );
		
		const letters = characters.filter( ( value, index, array ) => { 
			return isLetter( value ) && array.indexOf( value ) === index;
		} );

		for ( const character of characters ) { 
			if ( 
				!isLetter( character ) ||
				selectedLetters.includes( character ) 
			) {
				result.push( character );
				continue;
			}

			result.push( "\\_" );
		}

		const lettersLeft = game.lettersLeft = letters.length - selectedLetters.length;

		return `Topic: ${topicName}
		**${result.join( " " )}**
		Tries: ${triesLeft}
		Used letters (${lettersLeft} left): ${selectedLetters.length ? "None" : selectedLetters.join( ", " )}`;
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

		return `This Hangman game has now concluded. Here are the results: \n${results.join( "\n" )}`;
	}
} );

const selectPhrase = game => { 
	const { topic, currentTopic, completedPhrases = [ ], remainingPhrases = null } = game;

	const topicArray = Object.keys( topics ).filter( t => { 
		const { phrases } = topics[ t ];

		return phrases.every( p => completedPhrases.includes( p ) );
	} );

	let targetTopic = "", randomTopic = false;

	if ( topic === currentTopic ) { 
		targetTopic = currentTopic;
	}

	if ( 
		targetTopic !== currentTopic ||
		!topicArray.includes( targetTopic ) 
	) { 
		const randomIndex = Math.floor( Math.random( ) * topicArray.length );
		targetTopic = topicArray[ randomIndex ];
		randomTopic = true;
	}

	const { phrases, name } = topics[ targetTopic ];

	const phrasesToSearch = phrases.filter( p => { 
		return !completedPhrases.includes( p );
	} );

	const randomPhraseIndex = Math.floor( Math.random( ) * phrasesToSearch.length );

	const { value, points } = phrasesToSearch[ randomPhraseIndex ];

	game.currentPhrase = value;

	game.completedPhrases.push( value );

	game.topicName = name;

	game.pointAmount = parseInt( points );
	
	if ( remainingPhrases == null ) { 
		game.remainingPhrases = randomTopic ? 
			topicArray.reduce( ( accumulator, key ) => { 
				const { phrases : { length } } = topics[ key ];
				return accumulator + length;
			}, 0 ) :
			phrases.length;
	} else { 
		--game.remainingPhrases;
	}

	game.remainingLetters = [ ];

	game.selectedLetters = [ ];

	game.lettersLeft = 0;
};

const gameLoop = ( ) => { 
	for ( const key in GAMES ) { 
		const game = GAMES[ key ];
		const {
			message,
			stage,
			counter,
			remainingPhrases,
			points
		} = game;

		if ( stage === "BEGIN" ) {
			let string = STAGES[ stage ]( counter );
			message.edit( string );

			if ( counter < 1 ) {
				game.stage = "IN_GAME";
				game.counter = 75;

				selectPhrase( game );

				string = STAGES[ game.stage ]( game );
				message.edit( string );
			}
		} else if ( stage === "IN_GAME" ) {
			if ( 
				counter < 1 ||
				remainingPhrases === 0
			) { 
				game.stage = "END";

				const string = STAGES[ game.stage ]( points );
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
			group : "games",
			aliases : [ "hang-man", "h" ],
			description : "Initializes the Hangman game."
		} );

		bot.on( "message", message => { 
			const { channel, content, member } = message;
			const { id } = channel;

			const game = GAMES?.[ id ];

			if ( game?.currentPhrase && !member.user.bot ) {
				message.delete( );

				if ( game.stage === "IN_GAME" ) {
					const {
						points,
						topicName,
						topic,
						currentTopic,
						pointAmount,
						currentPhrase,
						selectedLetters,
						remainingLetters,
						remainingPhrases,
						stage
					} = game;

					const seconds = 2;

					const lcContent = content.toLowerCase( );

					const lcCurrentPhrase = currentPhrase.toLowerCase( );

					if ( 
						lcContent.length > 1 &&
						lcContent === lcCurrentPhrase
					) { 
						points[ member.id ] = points[ member.id ] || 0;

						const accumulatedPoints = pointAmount + points[ member.id ];
						points[ member.id ] = accumulatedPoints;

						message
							.reply( `You have received ${pointAmount} point${pointAmount === 1 ? "" : "s"} (${points[ member.id ]} total)` )
							.then( msg => msg.delete( { timeout : 1000 * seconds } ) );
						
						setTimeout( ( ) => { 
							if ( stage === "IN_GANE" ) {
								selectPhrase( game );

								const string = STAGES[ game.stage ]( game );

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

					message.delete( );
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
					topic,
					remainingLetters : [ ],
					remainingPhrases : 0,
					completedPhrases : [ ],
					selectedLetters : [ ],
					points : { }
				};
			} );
	}
}
/*
const isLetter = ( string = "" ) => string.length === 1 && /[\w]/.test( string );

const GAMES = { };

const STAGES = Object.freeze( { 
	BEGIN : ( counter ) => { 
		return `A new "Hangman" game is stating in ${counter} seconds!`;
	},
	IN_GAME : ( selectedLetters = [ ], phrase, topic, game ) => { 
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
				!isLetter( letter ) ||
				selectedLettersUniq.includes( letter )
			) {
				result.push( letter );
				continue;
			}

			result.push( "\\_" );
		}

		game.lettersLeft = lettersUniq.length - selectedLettersUniq.length;

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

		return `This Hangman game has now concluded. Here are the results: \n${results.join( "\n" )}`;
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

	game.remainingLetters = [ ];

	game.selectedLetters = [ ];

	game.lettersLeft = 0;
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

					message.delete( );
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
					remainingLetters : [ ],
					selectedLetters : [ ],
					completedPhrases : [ ],
					remainingPhrases : 0,
					topic,
					points : { }
				};
			} );
	}
}
*/