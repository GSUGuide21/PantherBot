const { Collection, Snowflake } = require( "discord.js" );
const Game = require( "./game" );

module.exports = class GameController { 
	constructor( { name } ) { 
		this.name = name;
		/** @type {Collection<Snowflake, Game>} */
		this.games = new Collection( );
		this.canonicalStages = [ "STARTING", "IN_GAME", "ENDING" ];
	}

	loop( ) { 
		this.games.forEach( ( game, key ) => { 
			const { 
				message,
				stage
			} = game;

			console.log( message, stage );

			if ( stage === "STARTING" ) { 
				let string = this.start( game );
				message.edit( string );

				if ( game.counter < 1 ) { 
					string = this.init( game );
					message.edit( string );
				}

				--game.counter;

				return;
			}

			if ( stage === "IN_GAME" ) { 
				if ( game.counter < 1 ) { 
					const string = this.end( game );
					message.edit( string );

					this.games.delete( key );

					return;
				}
			}

			--game.counter;
		} );

		setTimeout( ( ) => this.loop( ), 1000 );
	}

	addGame( msg, text, options ) { 
		console.error( ReferenceError( "The addGame() method must be dispatched in its child class." ) );
	}

	start( ) { 
		console.error( ReferenceError( "The start() method must be dispatched in its child class." ) );
	}

	init( ) { 
		console.error( ReferenceError( "The init() method must be dispatched in its child class." ) );
	}

	/*inGame( ) { 
		console.error( ReferenceError( "The inGame() method must be dispatched in its child class." ) );
	}*/

	end( ) { 
		console.error( ReferenceError( "The end() method must be dispatched in its child class." ) );
	}
};