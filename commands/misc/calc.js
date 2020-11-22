import Discord from "discord.js";
// import Calculator from "./../../calculator.js";

export default {
	commands : [ "calculator", "calc" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) {
		// const c = Calculator.parse( text );
		msg.channel.send( text );
	}
};