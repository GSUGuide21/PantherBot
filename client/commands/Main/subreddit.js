const { Command } = require( "discord.js-commando" );
const { MessageEmbed, DMChannel, TextChannel, NewsChannel, Message } = require( "discord.js" );
const axios = require( "axios" ).default;

module.exports = class SubredditCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name: "subreddit",
			memberName: "subreddit",
			group: "main",
			aliases: [ "gsu-reddit", "gsureddit", "sr" ],
			description: "Creates an embed with information about the latest post on r/GaState",
			argsType: "multiple"
		} );
	}

	/**
	 * @param {Object} message 
	 * @param {DMChannel|TextChannel|NewsChannel} message.channel
	 * @param {string[]} args 
	 */
	async run( { channel }, args ) { 
		const types = Object.freeze( [ "new", "top", "rising", "hot" ] );
		const type = types.includes( args?.[ 0 ] ) ? type : "new";

		const apiURL = `https://www.reddit.com/r/GaState/${type}.json?limit=1`;

		try { 
			const response = await axios.get( apiURL, { responseType: "json" } );
			const { data } = response;
			const { data: subdata } = data;
			
			const post = subdata?.children?.[ 0 ];

			const { 
				title, selftext, url, num_comments,
				author, score, created
			} = post;

			const description = `${selftext.slice( 0, 200 )}...`;
			const date = new Date( created * 1000 );

			const pad = n => ( n < 10 && n > -10 ) ? ( `${( n < 0 ) ? "-" : ""}0${Math.abs( n )}` ) : String( n );

			const parseFromDate = d => { 
				const month = d.getMonth( ) + 1, day = d.getDate( ), year = d.getFullYear( );
				const hours = d.getHours( ), minutes = d.getMinutes( ), seconds = d.getSeconds( );

				const dString = [ month, day, year ].map( pad ).join( "/" );
				const tString = [ hours, minutes, seconds ].map( pad ).join( ":" );

				return `${dString} ${tString}`;
			};

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
					value: parseFromDate( date )
				}, { 
					name: "Author",
					value: `${author} (https://www.reddit.com/u/${author})`
				} ]
			} );

			return channel.send( { embed } );
		} catch( e ) { 
			this.log( "Error loading subreddit data: ", e );
			return channel.send( "Error loading subreddit data!" );
		}
	}
}