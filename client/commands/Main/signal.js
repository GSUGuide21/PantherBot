const { Command } = require( "discord.js-commando" );
const { MessageEmbed } = require( "discord.js" );
const urlExists = require( "url-exist" );

const slug = title => String( title )
	.toLowerCase( )
	.replace( /\s+/g, "-" )
	.replace( /[^\u0100-\uFFFF\w-]/g, '-' )
	.replace( /--+/g, "-" )
	.replace( /^-+/, "" )
	.replace( /-+$/g, "" );

module.exports = class SignalCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "signal",
			memberName: "signal",
			group: "main",
			description: "Sends a link from the Signal."
		} );
	}

	async run( { channel }, title ) { 
		const slugged = slug( "title" );
		const base = "https://www.georgiastatesignal.com";
		const url = `${base}/${slugged}`;
		const image = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";

		try { 
			const exists = await urlExists( url );

			if ( !exists ) return channel.send( "The Signal article you are seeking does not exist." );

			const embed = new MessageEmbed( { 
				url, title,
				color: 0x35bfef,
				author: { 
					name: "The Signal",
					iconURL: image,
					url: base
				}
			} );

			return channel.send( { embed } );
		} catch ( e ) { 
			return channel.send( "The Signal article you are seeking does not exist." );
		}
	}
}