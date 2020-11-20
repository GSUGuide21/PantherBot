import Discord from "discord.js";

export default { 
	commands : [ "coin", "coin-flip" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg ) {
		const a = [ "Heads", "Tails" ];

		const r = Math.floor( Math.random( ) * a.length );

		const n = a[ r ];

		return msg.channel.send( `PantherBot has flipped a coin. It was ${n}` );
	}
};