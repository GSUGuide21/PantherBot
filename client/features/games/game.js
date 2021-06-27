const { Message } = require( "discord.js" );

module.exports = class Game { 
	/** @typedef {Object<string, number>} Points */
	/** @typedef {Object<string, number>} Counters */

	/** 
	 * @typedef {Object} GameOptions
	 * @property {Message} message
	 * @property {string} stage
	 * @property {Object<string, Points>} points
	 * @property {Object<string, Counters>} counters
	 */

	/**
	 * @param {GameOptions} options
	 */
	constructor( options ) {
		const { 
			message, 
			points = { },
			counters = { },
			stage = "STARTING"
		} = options;

		this.counters = counters;
		this.counter = this.counters?.[ stage ] ?? 5;

		this.message = message;
		this.points = points;

		this.stage = stage;
	}
}