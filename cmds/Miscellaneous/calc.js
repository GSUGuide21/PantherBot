const { Command } = require( "discord.js-commando" );
const calculate = require( "@root/calculate.js" );

module.exports = class CalculatorCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "calc",
			aliases : [ "calculate" ],
			argsType : "single",
			group : "miscellaneous",
			memberName : "calc",
			description : "Coming soon!"
		} );
	}

	async run( { channel }, value ) { 
		return channel.send( calculate( value ) );
	}
}