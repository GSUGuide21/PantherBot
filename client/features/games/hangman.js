const Controller = require( "./base" );
const Game = require( "./game" );
const { phrases } = require( "./phrases.json" );

class HangmanGame extends Game { 
	constructor( message ) { 
		super( { 
			counters: { 
				STARTING: 5,
				IN_GAME: 120
			},
			message
		} );

		this.currentPhrase = "";
		this.tries = 5;
		this.letters = Array.from( "ABCDEFGHIJKLMNOPQRSTUVWXYZ" );
		this.remainingLetters = [ ];
		this.remainingPhrases = [ ...phrases ];
	}

	selectPhrase( ) { 
		const { remainingPhrases } = this;
		const randomIndex = Math.floor( Math.random( ) * remainingPhrases.length );

		this.currentPhrase = remainingPhrases[ randomIndex ];
		this.remainingLetters = [ ...this.currentPhrase ];

		const currentIndex = remainingPhrases.indexOf( this.currentPhrase );
		this.remainingPhrases.splice( currentIndex, 1 );
	}

	changePhrase( ) { 
		let letters = [ ];
	}
}