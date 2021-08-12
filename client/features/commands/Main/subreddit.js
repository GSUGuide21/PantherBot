const { MessageEmbed, DMChannel, TextChannel, NewsChannel, ThreadChannel, Message } = require( "discord.js" );
const axios = require( "axios" ).default;
const PantherBotCommand = require( "../../../command" );

module.exports = class SubredditCommand extends PantherBotCommand { 
	constructor( context, options ) { 
		super( context, {
			...options, 
			name: "subreddit",
			aliases: [ "gsu-reddit", "gsureddit", "sr" ],
			description: "Creates an embed with information about the latest post on r/GaState"
		} );
	}

	log = console.log;
	
	trunc = ( text, length ) => `${text.slice( 0, length - 3 )}...`;
	pad = n => ( n < 10 && n > -10 ) ? ( `${( n < 0 ) ? "-" : ""}0${Math.abs( n )}` ) : String( n );
	parse = d => { 
		const month = d.getMonth( ) + 1, day = d.getDate( ), year = d.getFullYear( );
		const hours = d.getHours( ), minutes = d.getMinutes( ), seconds = d.getSeconds( );

		const dString = [ month, day, year ].map( pad ).join( "/" );
		const tString = [ hours, minutes, seconds ].map( pad ).join( ":" );

		return `${dString} ${tString}`;
	};

	/**
	 * @param {Message} message
	 * @param {string[]} args 
	 */
	run = async ( { channel }, args ) => { 
		const types = Object.freeze( [ "new", "top", "rising", "hot" ] );
		const type = types.includes( args[ 0 ] ) ? type : "new";

		const url = `https://www.reddit.com/r/GaState/${type}.json?limit=1`;

		try { 
			const response = await axios.get( url, { responseType: "json" } );
			const { data: { data } } = response;
			const post = data?.children?.[ 0 ];

			const { title, selftext, url, num_comments, author, score, created } = post;
			const description = this.trunc( selftext, 200 );
			const date = new Date( created * 1000 );

			const embed = new MessageEmbed( { 
				title,
				author: { 
					name: "r/GaState",
					iconURL: "https://styles.redditmedia.com/t5_2s6ds/styles/communityIcon_3nhlxejbgjy01.png?width=256&s=cb2f91f1599dc3d32b164a3563f2bbac0961bde6",
					url: "https://www.reddit.com/r/GaState"
				},
				url,
				description,
				fields: [ { 
					name: "Comments",
					value: Number( num_comments ).toLocaleString( "en-US" ),
					inline: true
				}, { 
					name: "Score",
					value: Number( score ).toLocaleString( "en-US" ),
					inline: true
				}, { 
					name: "Created",
					value: this.parse( date )
				}, { 
					name: "Author",
					value: `${author} (https://www.reddit.com/u/${author})`
				} ]
			} );

			return channel.send( { embeds: [ embed ] } );
		} catch ( e ) { 
			this.log( `Error loading subreddit data: ${e}` );
			return channel.send( "Error loading subreddit data!" );
		}
	};
}