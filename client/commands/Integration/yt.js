const { MessageEmbed } = require( "discord.js" );
const { Command } = require( "discord.js-commando" );
const axios = require( "axios" ).default;

module.exports = class YouTubeCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "yt",
			aliases : [ "youtube", "ytbe", "ytb" ],
			memberName : "yt",
			group : "integration",
			description : "Creates a detailed YouTube embed."
		} );
	}

	async run( { channel }, args ) { 
		if ( !args ) return channel.send( "A YouTube video ID or URL must be present." );

		const youtubeURLPattern = /^(?:(?:https?:|)\/\/|)(?:(?:www\.|)youtube\.com|youtu\.be)\/?/;

		const isYouTubeURL = string => youtubeURLPattern.test( string );

		const isWatchURL = isYouTubeURL( args ) === true;

		let videoIDorURL = "";

		if ( isWatchURL ) { 
			const urlPart = args.replace( youtubeURLPattern, "" );
			const youtubeShortPattern = /^(?:(?:https?:|)\/\/|)youtu\.be/;
			const isShortURL = string => youtubeShortPattern.test( string );

			if ( isShortURL( args ) ) { 
				if ( !urlPart ) return channel.send( "A YouTube video ID is required." );
				videoIDorURL = urlPart.split( /[/?&]/g )[ 0 ];
				videoIDorURL = `https://www.youtube.com/watch?v=${ videoIDorURL }`;
			} else { 
				const watchPrefix = /watch\?v=/;
				const videoID = urlPart.replace( watchPrefix, "" );
				if ( !videoID ) return channel.send( "A YouTube video ID is required." );
				videoIDorURL = args;
			}
		} else {
			videoIDorURL = args;
		}

		const watchURL = 
			isWatchURL ? 
				videoIDorURL :
				`https://www.youtube.com/watch?v=${ videoIDorURL }`;
		
		const requestURL = new URL( "https://www.youtube.com/oembed" );
		requestURL.searchParams.append( "url", watchURL );
		requestURL.searchParams.append( "format", "json" );

		try { 
			const { data = null } = await axios.get( String( requestURL ) );

			if ( data === null ) return channel.send( `Error loading data from YouTube URL: ${watchURL}` );

			const { 
				title, 
				thumbnail_url,
				author_url,
				author_name
			} = data;

			const thumbnail = thumbnail_url.replace( /hqdefault\.jpg$/, "maxresdefault.jpg" );

			const embed = new MessageEmbed( { 
				title,
				image: thumbnail,
				color : 0xDD0000,
				author: { 
					name: "YouTube",
					url: "https://www.youtube.com"
				},
				fields: [ { 
					name: "Creator",
					value: author_name,
					inline: true
				}, { 
					name: "Creator URL",
					value: author_url,
					inline: true
				}, { 
					name: "Video URL",
					value: watchURL
				} ]
			} );

			return channel.send( { embed } );
		} catch ( e ) { 
			console.log( e );
			return channel.send( `Error loading data from YouTube URL: ${watchURL}` );
		}
	}
}