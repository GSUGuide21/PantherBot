const { Message, MessageButton } = require( "discord-buttons" );
const EventEmitter = require( "events" );
module.exports = class PantherBotButtonController extends EventEmitter { 
	/**
	 * @typedef {Object} ButtonControllerOptions
	 * @property {Message} target
	 * @property {MessageButton} button 
	 * @property {number!} timeout
	 */

	/**
	 * @param {ButtonControllerOptions} options 
	 */
	constructor( { target, button, timeout = 30000 } ) { 
		this.button = button;
		this.collector = target.createButtonCollector( this.checkButton, { time: timeout } );
		this.collector.on( "collect", this.handleButton );
	}

	checkButton = button => button.id === this.button.id;

	handleButton = button => { 
		if ( button.id !== this.button.id ) return;
		this.emit( "click", this, button );
	};
}