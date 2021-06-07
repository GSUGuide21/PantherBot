const { Message } = require( "discord.js" );
const PantherBotClient = require( "../.." );

class Game { 
	constructor( options = { } ) { 
		this.points = { };
		this.stage = "STARTING";
		this.options = { };
		this.counter = 0;
		this.message = null;

		const __PROPERTIES__ = Object.freeze( [ 
			"counter",
			"message"
		] );

		Object
			.getOwnPropertyNames( options )
			.forEach( key => { 
				if ( __PROPERTIES__.includes( key ) ) { 
					this[ key ] = options?.[ key ] ?? this[ key ];
				} else { 
					this.options[ key ] = options?.[ key ] ?? this.options[ key ];
				}
			} );
	}

	start( ) { 
		this.stage = "STARTING";
	}

	inGame( ) { 
		this.stage = "IN_GAME";
	}

	end( ) { 
		this.stage = "ENDING";
	}
};

class GameController { 
	constructor( options = { } ) {
		/** @type {Object<string, Game>} */
		this.activeGames = { };
		/** @type {PantherBotClient} */
		this.client = null;

		this.options = { };

		const __PROPERTIES__ = Object.freeze( [ 
			"client"
		] );

		Object
			.getOwnPropertyNames( options )
			.forEach( key => { 
				if ( __PROPERTIES__.includes( key ) ) { 
					this[ key ] = options?.[ key ] ?? this[ key ];
				} else { 
					this.options[ key ] = options?.[ key ] ?? this.options[ key ];
				}
			} );
	}

	/**
	 * @param {Message} msg
	 * @param {Object} options
	 */
	async prepareGame( msg, options ) { 
		const { channel } = msg;
		const { id } = channel;
		await msg.delete( );

		try { 
			const message = await channel.send( this.prepMessage );
			await this.createGame( id, message, options );
		} catch ( e ) { 
			this.client.warn( e );
			await channel.send( this.errorMessage );
		}
	}

	/**
	 * @param {string} id 
	 * @param {Message} message 
	 * @param {*} options 
	 */
	async createGame( id, message, options ) { 
		this.activeGames[ id ] = new Game( { 
			message,
			...options
		} );
	}
};

module.exports = { Game, GameController };