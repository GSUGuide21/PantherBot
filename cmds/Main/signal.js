const { Command } = require( "discord.js-commando" );
const { MessageEmbed } = require( "discord.js" );
const slug = require( "@util/slug.js" );

module.exports = class SignalCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "signal",
			memberName : "signal",
			group : "main",
			description : "Sends a link from The Signal"
		} );
	}

	async run( { channel }, title ) { 
		const slugged = slug( title );
		
		const signalURL = "https://www.georgiastatesignal.com";

		const signalImage = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";

		const url = `${signalURL}/${slugged}`;

		const embed = new MessageEmbed( { 
			url,
			color : 0x35bfef,
			title,
			author : { 
				name : "The Signal",
				iconURL : signalImage,
				url : signalURL
			}
		} );

		return channel.send( { embed } );
	}
}