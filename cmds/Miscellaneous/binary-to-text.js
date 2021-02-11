const { Command } = require( "discord.js-commando" );

module.exports = class Binary2TextCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "binary-to-text",
			aliases : [ "b2t", "btt", "binary2text" ],
			memberName : "binary-to-text",
			description : "Converts a binary string to plain text",
			group : "Miscellaneous",
			argsType : "single"
		} );
	}

	async run( message, args ) {
		let binaryString = String( args ).replace( /\s+/g, "" );

		let binaryResult = "";

		while ( binaryString.length ) { 
			const binaryPart = binaryString.substr( 0, 8 );

			const binaryInteger = parseInt( binaryPart, 2 );

			const stringFromBinary = String.fromCharCode( binaryInteger );

			binaryString = binaryString.substr( 8 );

			binaryResult = binaryResult.concat( stringFromBinary );
		}

		return message.channel.send( binaryResult );
	}
}