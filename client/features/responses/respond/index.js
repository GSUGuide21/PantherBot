const { Message } = require("discord.js");
const PantherBotClient = require( "../../.." );

/**
 * @typedef {(message: Message, client: PantherBotClient) => Promise<any>} ResponseCallback
 * @typedef {Object<string, ResponseCallback>} ResponseObject
 */

/**
 * @type {ResponseObject}
 */
module.exports = { 
	roll: async message => { 
		const { channel } = message;

		const number = Math.floor( ( Math.random( ) * 6 ) + 1 );
		return channel.send( `PantherBot has rolled the dice. The number is ${number}!` );
	}
};