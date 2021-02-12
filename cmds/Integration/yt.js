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

		const youtubeEmbed = new MessageEmbed( { 
			color : 0xDD0000
		} );

		const youtubeURLPattern = /^(?:(?:https?:|)\/\/|)(?:(?:www\.|)youtube\.com|youtu\.be)\/?/;

		const isYouTubeURL = string => youtubeURLPattern.test( string );

		const isWatchURL = isYouTubeURL( args ) === true;

		let videoIDorURL = "";

		if ( isYouTubeURL( args ) ) { 
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

		const { data, iserror, error = null } = await axios.get( String( requestURL ) )
			.then( response => ( { data : response.data, iserror : false } ) )
			.catch( error => ( { data : "", iserror : true, error } ) );
		
		if ( iserror ) {
			return channel
				.send( "Error loading data from YouTube." )
				.then( ( ) => console.log( error ) );
		}

		const { 
			title, 
			thumbnail_url,
			author_url,
			author_name
		} = data;

		const thumbnailURL = thumbnail_url.replace( /hqdefault\.jpg$/, "maxresdefault.jpg" );

		const inline = true;

		const creatorField = { 
			name : "Creator",
			value : author_name,
			inline
		};

		const creatorURLField = {
			name : "Creator URL",
			value : author_url,
			inline
		}; 

		const videoURLField = { 
			name : "Video URL",
			value : watchURL
		};

		youtubeEmbed
			.setAuthor( "YouTube", "", "https://www.youtube.com" )
			.setTitle( title )
			.setImage( thumbnailURL )
			.addFields( [ creatorField, creatorURLField, videoURLField ] );
		
		return channel.send( { embed : youtubeEmbed } );
	}
}