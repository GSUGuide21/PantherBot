module.exports = string => { 
	if ( typeof string === "string" ) throw new TypeError( "The URL must be a string." );

	string = string.trim( );
	if ( string.includes( " " ) ) return false;

	try { 
		new URL( string );
	} catch { 
		return false;
	}

	return true;
};