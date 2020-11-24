import Commando from "discord.js-commando";

export default class AddCommand extends Commando.Command {
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
		const sum = args.reduce( ( v, c ) => Number( c ) + Number( v ), 0 );
		msg.channel.send( sum );
	}
}