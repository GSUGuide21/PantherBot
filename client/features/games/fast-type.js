const { GameController, Game } = require( "./game" );

class FastTypeGame extends Game { 
	constructor( ) { 
		super( );

		this.remainingWords = this.options.remainingWords;
		this.currentWord = "";
	}

	selectWord( ) { 
		const { remainingWords } = this;
		const randIndex = Math.floor( Math.random( ) * remainingWords.length );

		this.currentWord = remainingWords[ randIndex ];
		const currIndex = remainingWords.indexOf( this.currentWord );
		this.remainingWords.splice( currIndex, 1 );
	}
}

module.exports = class FastType extends GameController { 
	constructor( client ) { 
		super( { 
			name: "FastType",
			client,
			...options
		} );
	}

	async prepareGame( msg ) { 
		return super.prepareGame( msg, { 
			stage: "STARTING",
			counter: 5,
			remainingWords: [ ...words ]
		} );
	}

	gameLoop( ) { 
		for ( const key in this.activeGames ) { 
			const game = this.activeGames[ key ];
			const { message, stage } = game;

			
			--game.counter;
		}
	}

	selectWord( game ) { 

	}
}