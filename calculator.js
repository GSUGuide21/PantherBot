const factorial = x => { 
	if ( x < 0 ) return -1;

	else if ( x === 0 ) return 1;

	return ( x * factorial( x - 1 ) );
};

const OPERATORS = new Map( [ 
	[ "+", "add" ],
	[ "-", "subtract" ],
	[ "*", "multiply" ],
	[ "/", "divide" ],
	[ "^", "power" ],
	[ "mod", "modulo" ]
] );

const FUNCTIONS = Object.freeze( { 
	// Basic calculator functions
	add : ( x, y ) => Number( x ) + Number( y ),
	subtract : ( x, y ) => Number( x ) - Number( y ),
	multiply : ( x, y ) => Number( x ) * Number( y ),
	divide : ( x, y ) => Number( x ) / Number( y ),
	power : ( x, y ) => Math.pow( Number( x ), Number( y ) ),
	modulo : ( x, y ) => Number( x ) % Number( y ),
	// Trigonometric functions
	sin : x => Math.sin( x ),
	cos : x => Math.cos( x ),
	tan : x => Math.tan( x ),
	csc : x => 1 / Math.sin( x ),
	sec : x => 1 / Math.cos( x ),
	cot : x => 1 / Math.tan( x ),
	// Inverse trigonometric functions
	asin : x => Math.asin( x ),
	acos : x => Math.acos( x ),
	atan : x => Math.atan( x ),
	acsc : x => Math.asin( 1 / x ),
	asec : x => Math.acos( 1 / x ),
	acot : x => Math.atan( 1 / x ),
	// Exponential and radical functions
	sq : x => Math.pow( x, 2 ),
	cb : x => Math.pow( x, 3 ),
	sqrt : x => Math.sqrt( x ),
	cbrt : x => Math.cbrt( x ),
	nthrt : ( x, y ) => Math.pow( x, 1 / y ),
	// Other
	recip : x => 1 / Number( x ),
	neg : x => Number( x ) * -1,
	abs : x => Math.abs( x ),
	factorial : x => factorial( x )
} );

export default class Calculator { 
	static parse( s ) {
	}
}