const axios = require( "axios" ).default;
const isUrl = require( "./is-url" );

module.exports = async url => { 
	if ( typeof url !== "string" ) { 
		throw new TypeError( `The URL must be a string. The type of value provided is ${typeof url}` );
	}

	if ( !isUrl( url ) ) return false;

	const response = await axios.head( url );

	return response && ( response.status < 400 || response.status >= 500 );
};