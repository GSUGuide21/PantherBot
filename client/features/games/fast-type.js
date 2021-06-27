const Controller = require( "./base" );
const Game = require( "./game" );
const { MessageEmbed } = require( "discord.js" );
const { words } = require( "./words.json" );

class FastTypeGame extends Game { 
	constructor( message ) { 
		super( { 
			counters: { 
				STARTING: 8,
				IN_GAME: 45
			},
			message 
		} );

		this.currentWord = "";
		this.remainingWords = [ ...words ]; 
	}

	selectWord( ) { 
		const { remainingWords } = this;
		const randomIndex = Math.floor( Math.random( ) * remainingWords.length );

		this.currentWord = remainingWords[ randomIndex ];
		const currentIndex = remainingWords.indexOf( this.currentWord );

		this.remainingWords.splice( currentIndex, 1 );
	}

	changeWord( ) { 
		let word = "";

		for ( const letter of [ ...this.currentWord ] ) { 
			word += letter;
			word += " ";
		}

		return `The word is ***${word.trim( )}***!`;
	}

	async givePoint( member, message ) { 
		if ( this.stage !== "IN_GAME" ) return console.error( "The givePoint() method must be dispatched when a game is in progress." );
		const { points } = this;
		this.points[ member.id ] = this.points[ member.id ] ?? 0;

		const target = await message
			.reply( `You have received 1 point (${++points[ member.id ]} total)!` );

		const timeout = setTimeout( ( ) => { 
			target.delete( );
			clearTimeout( timeout );
			if ( this.stage !== "IN_GAME" ) return;
			this.selectWord( );
			this.message.edit( this.changeWord( ) );
		}, 2000 );
	}
}

class FastTypeController extends Controller { 
	constructor( ) { 
		super( { name: "Fast Type" } );
	}

	addGame( msg ) { 
		const { channel } = msg;
		msg.delete( );

		channel
			.send( `Preparing a ${this.name} game!` )
			.then( message => { 
				this.games.set( channel.id, new FastTypeGame( message ) );
			} );
	}

	start( game ) { 
		const { counter } = game;
		return `A new "${this.name}" game is starting in ${counter} seconds!`;
	}

	init( game ) { 
		game.stage = "IN_GAME";
		game.counter = game.counters[ game.stage ];

		game.selectWord( );

		return game.changeWord( );
	}

	end( game ) { 
		const { points } = game;

		const sorted = Object
			.getOwnPropertyNames( points )
			.sort( ( a, b ) => points[ b ] - points[ a ] );

		const highest = Math.max( ...sorted.map( x => points[ x ] ) );

		const result = sorted.map( ( x, i ) => { 
			const p = points[ x ];
			const o = new Intl.PluralRules( "en-us", { type: "ordinal" } );
			const t = Object.freeze( { 
				one: "st",
				two: "nd",
				few: "rd",
				other: "th"
			} );
			const c = `${Number( ( p / highest ) * 100 ).toFixed( 2 )}%`;
			const f = n => `${parseInt( n ).toLocaleString( "en-US" )}${t[ o.select( parseInt( n ) ) ]}`;
			return Object.freeze( [ 
				`***${f( i + 1 )} place***`, 
				`<@${x}> (${p} point${p === 1 ? "" : "s"}, ${c})` 
			] ).join( ": " );
		} );

		return result;
	}
}

exports.FastTypeGame = FastTypeGame;
exports.FastTypeController = FastTypeController;