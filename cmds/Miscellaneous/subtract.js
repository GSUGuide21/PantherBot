import Commando from "discord.js-commando";

export default class SubtractCommand extends Commando.Command {
	constructor( bot ) {
		super( bot, { 
			name : "add",
			group : "misc",
			memberName : "add",
			description : "",
			argsType : "multiple"
		} );
	}

	/**
	 * @method run
	 * @param {Commando.CommandoMessage} msg
	 * @param {string[]} args
	 */
	async run( msg, args ) { 
		if ( !args.length ) { 
			return msg.reply( "the <add> command must have a minimum of 1 argument!");
		}
		
		let diff = Number( args.shift( ) || 0 );
		diff = args.reduce( ( v, c ) => Number( v ) - Number( c ), diff );
		msg.channel.send( diff );
	}
}