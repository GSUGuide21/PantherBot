/**
 * @description Converts the title to a URL slug
 * @param {string} s 
 * @returns {string}
 **/
module.exports = ( s ) => { 
	const r = String( s )
        .toLowerCase( )
        .replace( /\s+/g, "-" )
        .replace( /[^\u0100-\uFFFF\w-]/g, '-' )
        .replace( /--+/g, "-" )
        .replace( /^-+/, "" )
        .replace( /-+$/g, "" );
    return r;
}