const escapeRegexp = require( '@root/escapeRegexp.js' );

const factorial = n => {
	if ( n < 0 ) return -1;
	else if ( n === 0 ) return 1;
	return n * factorial( n - 1 );
};

const logBase = function( x, y ) { 
	if ( arguments.length === 0 ) return NaN;
	if ( arguments.length === 1 ) return Math.log10( x );
	const logrx = Math.log( x ), logry = Math.log( y );
	return logrx / logry;
};

const operators = Object.freeze( { 
	add : Object.freeze( { 
		symbols : Object.freeze( [ "+" ] ),
		position : "middle",
		parse : ( x, y ) => Number( x ) + Number( y )
	} ),
	subtract : Object.freeze( { 
		symbols : Object.freeze( [ "-" ] ),
		singleArgument : false,
		parse : ( x, y ) => x - y
	} ),
	multiply : Object.freeze( { 
		symbols : Object.freeze( [ "*", "×", "·" ] ),
		singleArgument : false,
		parse : ( x, y ) => x * y
	} ),
	divide : Object.freeze( { 
		symbols : Object.freeze( [ "/", "÷" ] ),
		singleArgument : false,
		parse : ( x, y ) => x / y
	} ),
	power : Object.freeze( { 
		symbols : Object.freeze( [ "^" ] ),
		singleArgument : false,
		parse : ( x, y ) => Math.pow( x, y )
	} ),
	modulo : Object.freeze( { 
		symbols : Object.freeze( [ "mod" ] ),
		singleArgument : false,
		parse : ( x, y ) => x % y
	} ),
	percentage : Object.freeze( { 
		symbols : Object.freeze( [ "%" ] ),
		singleArgument : true,
		parse : x => Number( x ) / 100
	} ),
	factorial : Object.freeze( { 
		symbols : Object.freeze( [ "!" ] ),
		singleArgument : true,
		parse : x => factorial( x )
	} )
} );

const constants = Object.freeze( { 
	pi : Object.freeze( { 
		value : Math.PI
	} )
} );

/**
 * @type {string[]}
 **/
const singleOperators = 
	Object
		.values( operators )
		.filter( x => x.singleArgument === true )
		.map( x => x.symbols )
		.flat( Infinity );

/**
 * @type {string[]}
 **/
const multiOperators =
	Object
		.values( operators )
		.filter( x => x.singleArgument === false )
		.map( x => x.symbols )
		.flat( Infinity );

const singleOperPattern = new RegExp( `(.*)(${singleOperators.map( escapeRegexp )})` );

const multiOperPattern = new RegExp( `(.*)(${multiOperators.map( escapeRegexp )})(.*)` );

const mathFunctions = Object.freeze( { 
	// Trigonometric functions
	sin : Math.sin,
	cos : Math.cos,
	tan : Math.tan,
	csc : value => 1 / Math.sin( value ),
	sec : value => 1 / Math.cos( value ),
	cot : value => 1 / Math.tan( value ),
	// Inverse trigonometric functions
	asin : Math.asin,
	acos : Math.acos,
	atan : Math.atan,
	acsc : value => Math.asin( 1 / value ),
	asec : value => Math.acos( 1 / value ),
	acot : value => Math.atan( 1 / value ),
	// Logarithmic functions
	log : logBase,
	ln : Math.log,
	// Other functions
	factorial,
	sqrt : Math.sqrt,
	cbrt : Math.cbrt,
	nrt : ( x, y ) => Math.pow( x, 1 / y ),
	pow : Math.pow
} );

function calculate( value ) { 
	console.log( value );
	return "TODO";
}

module.exports = calculate;