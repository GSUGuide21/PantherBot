const { MessageEmbed, Message } = require( "discord.js" );
const { Command } = require( "discord.js-commando" );
const axios = require( "axios" ).default;

module.exports = class RedditCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "reddit",
			aliases: [ "rd", "rdt" ],
			memberName: "reddit",
			group: "integration",
			description: "Creates a detailed Reddit embed.",
			argsType: "multiple"
		} );
	}

	/**
	 * @param {Message} message
	 * @param {string[]} args 
	 */
	async run( { channel }, args ) { 
		if ( !args?.length ) return channel.send( "A subreddit must be specified. Please try again." );
		const base = "https://www.reddit.com/r";
		const [ subreddit = "AskReddit", type = "top", limitString = 5 ] = args;

		let limit = parseInt( limitString );

		limit = ( !isNaN( limit ) || isFinite( limit ) ) ? limit : 5;

		if ( subreddit === "" ) return channel.send( "A subreddit must be specified. Please try again." );

		const allowedTypes = Object.freeze( [ "new", "top", "rising", "hot" ] );
		const canonicalType = allowedTypes.includes( type ) ? type : "top";

		const suburl = `${base}/${subreddit.split( /\/|\s+/g )[ 0 ]}`;
		const jsonurl = `${suburl}/${canonicalType}.json?limit=${limit}`;

		console.log( suburl, subreddit, jsonurl );

		channel.startTyping( );

		try { 
			const { data } = await axios.get( jsonurl, { responseType: "json" } );
			const { children: posts = [ ] } = data;

			console.log( data, posts );

			const index = Math.floor( Math.random( ) * children.length );
			const post = posts[ index ];

			const { 
				title,
				selftext,
				url,
				num_comments,
				author,
				score,
				created,
				data: postdata = { }
			} = post;

			const { 
				thumbnail = ""
			} = postdata;

			const description = `${selftext.slice( 0, 450 )}`;

			const timestamp = new Date( created * 1000 );
			
			const embed = new MessageEmbed( { 
				author: { 
					name: author,
					url: `https://www.reddit.com/u/${author}`
				},
				title,
				url,
				description,
				timestamp,
				fields: [ { 
					name: "Comments",
					value: Number( num_comments ).toLocaleString( "en-US" ),
					inline: true
				}, { 
					name: "Score",
					value: Number( score ).toLocaleString( "en-US" ),
					inline: true
				} ],
				footer: { 
					text: `r/${subreddit} (${suburl})`
				}
			} );

			if ( thumbnail ) embed.setImage( thumbnail );

			channel.send( { embed } );
		} catch ( e ) {
			console.log( e );
			channel.send( "Error finding info for a subreddit post." );
		} finally { 
			channel.stopTyping( );
		}
	}
}