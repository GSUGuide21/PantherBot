const { MessageEmbed, Message } = require( "discord.js" );
const axios = require( "axios" ).default;
const { Args } = require( "@sapphire/framework" );
const cheerio = require( "cheerio" );
const PantherBotCommand = require( "../../../command" );

module.exports = class SignalCommand extends PantherBotCommand { 
	constructor( context, options ) {
		super( context, { 
			...options,
			name: "signal",
			aliases: [ "gsu-signal" ],
			description: "Sends an article link from the Signal."
		} );
	}

	slug = title => String( title )
		.toLowerCase( )
		.replace( /\s+/g, "-" )
		.replace( /[^\u0100-\uFFFF\w-]/g, '-' )
		.replace( /--+/g, "-" )
		.replace( /-+$/g, "" )
		.replace( /[^\w ]+/g, '' );
	
	trunc = ( text, length ) => `${text.slice( 0, length - 3 )}...`;

	log = console.log;
	
	isUrl = string => { 
		if ( typeof string !== "string" ) throw new TypeError( "The URL must be a string." );
		string = string.trim( );
		if ( string.includes( " " ) ) return false;
		try { 
			new URL( string );
			return true;
		} catch { 
			return false;
		}
	};

	urlExists = async url => { 
		if ( typeof url !== "string" ) throw new TypeError( "The URL must be a string." );
		if ( !this.isUrl( url ) ) return false;

		const response = await axios.head( url );
		const { status = 400 } = response;
		console.log( response );
		return response && ( status < 400 || status >= 500 );
	};
	
	/**
	 * Scrapes the article for its details
	 * @param {cheerio.Cheerio<cheerio.Element>} $main 
	 */
	scrape = $main => { 
		const $category = $main.find( ".breaking-title-category > a" );
		const $title = $main.find( ".breaking-title" );
		const $authorDate = $main.find( ".breaking-title-date-author" );
		const $date = $authorDate.children( ":first-child" );
		const $author = $authorDate.children( ".author" );

		const $entry = $main.find( ".entry-content" );
		const $thumbnail = $entry.find( ".entry-thumbnail > img" );

		const $wrapper = $entry.find( ".wpb_text_column > .wpb_wrapper" );

		const category = $category.text( ), actualTitle = $title.text( );
		const date = $date.text( ), author = $author.text( );
		const thumbnail = $thumbnail.attr( "src" ), content = $wrapper.text( ).trim( );
		
		return { category, actualTitle, date, author, thumbnail, content };
	};

	/**
	 * @param {Message} message
	 * @param {Args} args 
	 * @returns 
	 */
	run = async ( { channel }, args ) => { 
		const title = await args.restResult( "string" );
		if ( !title.success ) channel.send( { content: "Failed to fetch the Signal article." } );
		const slugged = this.slug( title.value )/*.replaceAll( "'", "" )*/;
		console.log( slugged )
		const base = "https://www.georgiastatesignal.com";
		const url = `${base}/${slugged}`;
		console.log( url );
		const image = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";

		try { 
			const exists = await this.urlExists( url );
			if ( !exists ) return channel.send( "The Signal article you are seeking does not exist." );

			const { data } = await axios.get( url, { responseType: "text" } );
			const $ = cheerio.load( data );

			const $main = $( "#breaking-main-content" )
			const details = this.scrape( $main );

			const { content, author, actualTitle, date, category, thumbnail = image } = details;

			const embed = new MessageEmbed( { 
				color: 0x35bfef,
				url,
				title: actualTitle,
				author: { 
					name: "The Signal",
					iconURL: image,
					url: base
				},
				fields: [ { 
					name: "Date published",
					value: date
				}, { 
					name: "Author",
					value: author,
					inline: true
				}, { 
					name: "Category",
					value: category,
					inline: true
				} ],
				thumbnail,
				description: this.trunc( content, 300 )
			} );

			return channel.send( { embeds: [ embed ] } );
		} catch ( e ) { 
			return channel.send( "The Signal article you are seeking does not exist." );
		}
	};
};