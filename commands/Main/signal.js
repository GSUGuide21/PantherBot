import Discord from "discord.js";
import slug from "./../../util/slug.js";

export default {
	commands : [ "signal", "thesignal", "gsusignal" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) {
		const slugged = slug( text );

		const url = `https://www.georgiastatesignal.com/${ slugged }`;

		const signalImg = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";

		const signalUrl = "https://www.georgiastatesignal.com";
		
		const embed = new Discord.MessageEmbed( { 
			author : {
				name : "The Signal",
				iconURL : signalImg,
				url : signalUrl
			},
			color : 0x35bfef,
			url,
			title : text
		} );

		return await msg.channel.send( { embed } );
	}
};