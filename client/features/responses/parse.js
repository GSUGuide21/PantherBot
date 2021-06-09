const responses = require( "./data.json" );

module.exports = ( string, message, channel ) => { 
	const pattern = /\$([a-zA-Z\_]+(?:[a-zA-Z0-9\-\_]*[a-zA-Z0-9]*|))/g;
	const responseKey = Object
		.keys( responses )
		.find( key => { 
			const value = responses[ key ];

			const { 
				ask = "",
				patterns = { }
			} = value;

			const regexString = ask.replace( pattern, ( match, name ) => { 
				if ( patterns?.[ name ] ) return `(${patterns[ name ]})`;
				return match;
			} );

			const regex = new RegExp( regexString, "i" );

			return regex.test( string );
		} );
	
	const response = responses[ responseKey ];

	const { 
		ask: responseAsk = "", 
		patterns: askPatterns = { },
		name: responseName = key,
		reply = true
	} = response;

	if ( !ask ) return;

	const respond = require( `./respond/${responseName}` );

	const askRegex = new RegExp( responseAsk.replace( pattern, ( match, name ) => { 
		if ( askPatterns?.[ name ] ) return `(${askPatterns[ name ]})`;
		return match;
	} ) );

	const [ match = string, ...args ] = askRegex.exec( string ) ?? [ ];

	if ( typeof respond === "function" ) { 
		const returnValue = respond( args, match ) ?? "No response.";
		return ( reply ? message.reply : channel.send )( returnValue );
	} else { 
		return ( reply ? message.reply : channel.send )( String( respond ) ?? "No response." );
	}
};