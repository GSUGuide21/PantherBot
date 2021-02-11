const { Command } = require( "discord.js-commando" );

module.exports = class BinaryCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "binary",
			memberName : "binary",
			argsType : "single",
			group : "Miscellaneous",
			description : "Converts text to binary."
		} );
	}

	async run( message, args ) { 
		const trimmedString = String( args ).trim( );

		const stringParts = Array.from( trimmedString );

		const convertToBinary = character => { 
			const binaryCharacter = character.charCodeAt( 0 ).toString( 2 );
			const binaryLength = Math.max( 8 - binaryCharacter.length, 0 );
			return "0".repeat( binaryLength ) + binaryCharacter;
		};

		const binaryResult = stringParts.map( convertToBinary ).join( "" );

		return message.channel.send( binaryResult );
	}
}