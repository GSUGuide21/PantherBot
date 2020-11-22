import Discord from "discord.js";
import fs from "fs-extra";
import __dirname from "../dirname.js";

export default class Jumbo {
	static #round = 0;

	static #roundLimit = 3;

	static #host = "";

	static #players = [ ];
	/**
	 * @method	fetchWords
	 * @returns	{Promise<string[]>}
	 **/
	static async fetchWords( ) { 
		return await fs.readFile( `${__dirname}/jumbo/words.txt`, "utf-8" ).then( text => { 
			if ( !text ) return [ ];

			const pattern = /([^\n]+)/gim;

			const res = ( text.match( pattern ) || [ ] ).map( x => { 
				return x.trim( );
			} );

			return res.filter( x => x !== "" );
		} ).catch( ( ) => [ ] );
	}

	/**
	 * @method	getWord
	 * @returns {Promise<string>}
	 **/
	static async getWord( ) {
		const words = await Jumbo.fetchWords( );

		if ( !words.length ) return "";

		const { length } = words;
		const index = Math.floor( Math.random( ) * length );

		return words[ index ];
	}

	/**
	 * @method	getWordObject
	 * @returns {Promise<Map<string, string>>}
	 **/
	static async getWordObject( ) {
		const word = await Jumbo.getWord( );

		if ( !word ) return null;

		const chars = Array.from( word );

		const lpattern = /[A-Z\u00C0-\u024F\u1E00-\u1EFF]/i;

		const sIndices = [ ];

		for ( let [ i, w ] of chars.entries( ) ) {
			if ( lpattern.test( w ) ) continue;
			sIndices.push( i );
		}

		const letters = Array.from( chars )
			.filter( x => lpattern.test( x ) );

		const result = [ ];

		for ( let i = 0; i < chars.length; i++ ) {
			const ch = chars[ i ];
			
			if ( sIndices.includes( i ) ) {
				result[ i ] = ch;
				continue;
			}

			const chIndex = Math.floor( Math.random( ) * letters.length );

			const rch = letters[ chIndex ];

			result[ i ] = rch;

			letters.splice( chIndex, 1 );
		}

		return new Map( [ 
			[ "text", result.join( "" ) ],
			[ "correctWord", word ]
		] );
	}
	/**
	 * @method	start
	 * @param {Discord.Message} msg
	 * @returns {Promise<Map<string, string>>}
	 **/
	static async start( msg ) { 
		const wordObject = await Jumbo.getWordObject( );

		if ( !wordObject ) { 
			await Jumbo.sendError( "No words are found. Please try again!", msg );
			return;
		}

		msg.channel.send( "Jumbos has started. Please type +join to join the game!" );

		Jumbo.#round = 1;

		return wordObject;
	}
	/**
	 * @method hasPlayer
	 * @param {string} userid 
	 * @returns {boolean}
	 **/
	static async hasPlayer( userid ) { 
		const players = Jumbo.#players;
		return players.includes( userid );
	}
	/**
	 * @method join
	 * @param {Discord.Message} msg
	 * @param {Object} userObj
	 * @param {string} userObj.userid
	 * @param {boolean} userObj.host
	 **/
	static async join( msg, userObj ) { 
		const { userid, host = false } = userObj;

		const hasPlayer = await Jumbo.hasPlayer( userid );

		if ( hasPlayer ) {
			await Jumbo.sendError( `The user <@${userid}> is already playing the game!`, msg );
			return;
		}

		if ( host === true ) {
			Jumbo.#host = userid;
		}

		Jumbo.#players.push( userid );

		msg.channel.send( `<@${userid}> has entered the game!` );
	}
	/**
	 * @method leave
	 * @param {Discord.Message} msg
	 * @param {string} userid
	 */
	static async leave( msg, userid ) { 
		const hasPlayer = Jumbo.hasPlayer( userid );

		if ( !hasPlayer ) {
			await Jumbo.sendError( `The user <@${userid}> is currently not playing the game!`, msg );
			return;
		}

		const index = Jumbo.#players.indexOf( userid );

		Jumbo.#players.splice( index, 1 );

		const players = Jumbo.#players;

		if ( !players.length ) {
			await Jumbo.end( msg, { type : "noPlayers" } );
			return;
		}

		if ( Jumbo.#host === userid ) {
			const r = Math.floor( Math.random( ) * players.length );

			Jumbo.#host = players[ r ];
		}

		msg.channel.send( `<@${userid}> has left the game! <@${Jumbo.#host}> is the new host!` );
	}
	/**
	 * @method sendError
	 * @param {string} text
	 * @param {Discord.Message} msg
	 */
	static async sendError( text, msg ) { 
		const prefix = "JumboError:";

		return msg.channel.send( `${prefix} ${text}` );
	}
	/**
	 * @method setRoundLimit
	 * @param {number} n 
	 */
	static async setRoundLimit( n ) { 
		if ( n < 1 && isNaN( n ) && !isFinite( n ) ) return;
		Jumbo.#roundLimit = n;
	}
	/**
	 * @method	end
	 * @param {Discord.Message} msg
	 * @param {Object} opts
	 * @param {string} opts.type
	 * @returns {Promise<Map<string, string>>}
	 **/
	static async end( msg, opts ) { 
		Jumbo.#players = [ ];

		Jumbo.#host = "";

		Jumbo.#round = 0;

		Jumbo.#roundLimit = 3;
	}
}