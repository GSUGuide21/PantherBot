class Calculator { 
    constructor( ) { 
        this.NON_CAPTURES = { };
        this.NON_CAPTURES.CALC_VALUE = "^(?:\\-?(?:\\d+|\\d*\\.\\d+|[a-zπφϕγ]))$";
        this.NON_CAPTURES.CALC_FUNCTION_NAMES = "[a-z]+(?:[a-zπφϕγ]*(?:\\d+|\\d*\\.\\d+)*";
        this.NON_CAPTURES.CALC_FUNCTIONS = `^(?:${this.CALC_FUNCTION_NAMES})\\((?:.+)\\)$`;
        this.NON_CAPTURES.CALC_FUNCTIONS2 = `^(?:${this.CALC_FUNCTION_NAMES})\\s+(?:.+)$`;
        this.NON_CAPTURES.CALC_PARENTHESIS = `^\\((?:.+)\\)`;

        this.OPERATORS = Object.freeze( [ "+", "-", "*", "/", "^", "mod", "×", "⋅", "÷" ] );
        this.NON_CAPTURES.CALC_OPERATORS = `^(?:.+)\s+(?:${this.OPERATIONS.join( "|" )})\s+(?:.+)`;

        this.OPERATORS2 = Object.freeze( [ "!", "%" ] );
        this.NON_CAPTURES.CALC_OPERATORS2 = `^(?:.+)(?:${this.OPERATIONS2.join( "|" )})`;

		this.PATTERNS = Object.freeze( {
            NONCAPTURE : { },
            CAPTURE : { }
        } );

		this.OPERATIONS = Object.freeze( { 
            // Addition
			"+" : ( x, y ) => Number( x ) + Number( y ),
            // Subtraction
			"-" : ( x, y ) => x - y,
            // Multiplication
			"*" : ( x, y ) => x * y,
            // Division
			"/" : ( x, y ) => x / y,
            // Modulo
			"mod" : ( x, y ) => x % y,
            // Exponentiation
			"^" : Math.pow,
            // Percentage
            "%" : x => x / 100,
            // Factorial
            "!" : this.factorial,
            // Aliases
            "×" : "*",
            "⋅" : "*",
            "÷" : "/"
		} );

        this.FUNCTIONS = Object.freeze( { 
			// 1. Trigonometric functions
            // Sine
			sin : Math.sin,
            // Cosine
			cos : Math.cos,
            // Tangent
			tan : Math.tan,
            // Cosecant
			csc : x => 1 / Math.sin( x ),
            // Secant
			sec : x => 1 / Math.cos( x ),
            // Cotangent
			cot : x => 1 / Math.tan( x ),
			// 2. Inverse trigonometric functions
            // Arcsine
			asin : Math.asin,
            // Arccosine
			acos : Math.acos,
            // Arctangent
			atan : Math.atan,
            // Arccosecant
			acsc : x => Math.asin( 1 / x ),
            // Arcsecant
			asec : x => Math.acos( 1 / x ),
            // Arccotangent
			acot : x => Math.atan( 1 / x ),
			// 3. Logarithmic functions
            // Natural logarithm
			ln : Math.log,
            // Logarithm (base 10)
			log : Math.log10,
            // Logarithm (base x)
			logX : this.logX,
            // 4. Power and radical functions
            // Square
            sq : x => Math.pow( x, 2 ),
            // Cube
            cb : x => Math.pow( x, 3 ),
            // Power
            pow : Math.pow,
            // Square root
            sqrt : Math.sqrt,
            // Cube root
            cbrt : Math.cbrt,
            // Nth-root
            nthrt : this.nthrt,
			// 5. Other
            // Sum
			sum : this.sum,
            // Product
            product : this.product,
            // Permutation
            nPr : this.nPr,
            // Combination
            nCr : this.nCr,
			// 6. Aliases
            arcsin : "asin",
            arccos : "acos",
            arctan : "atan",
            arccsc : "acsc",
            arcsec : "asec",
            arccot : "acot",
            nrt : "nthrt",
            log_ : "logX",
            logBase : "logX",
            Σ : "sum",
            Π : "product"
		} );

        this.makePatterns( );
    }

    nPr( n, r ) { 
        return this.factorial( n ) / this.factorial( n - r );
    }

    nCr( n, r ) { 
        return this.nPr( n, r ) / this.factorial( r );
    }

    nthrt( x, y ) {
        return Math.pow( x, 1 / y );
    }

    logX( x, y ) { 
        return Math.log( y ) / Math.log( x );
    }

    factorial( n ) { 
        if ( n < 0 ) return -1;
        if ( n === 0 ) return 1;
        return n * this.factorial( n - 1 );
    }

    getRange( value ) { 
        const [ x, y = x ] = String( value ).split( /\:|\.\./g );
        if ( x === y ) return [ ];

        const xn = Number( x ), yn = Number( y );
        const min = Math.min( xn, yn ), max = Math.max( xn, yn );

        const range = [ ];

        for ( let i = min; i <= max; i++ ) { 
            range.push( i );
        }

        return range;
    }

    makePatterns( ) { 

    }

    getPattern( type ) { 

    }

    extract( variableValue ) { 
        const variablePattern = this.getPattern( "variable" );
        if ( !variablePattern.test( variableValue ) ) return { };
        const [ , variable, value ] = variablePattern.exec( variableValue );
        if ( !variable || !value ) return { };
        return { variable, value };
    }

    evaluate( equation, options ) { 

    }

    sum( equation, rangeByVariable ) { 
        const { variable = null, value = null } = this.extract( rangeByVariable );
        if ( !variable || !value ) return NaN;
        const range = this.getRange( value );
        return range.reduce( ( accumulator, current ) => { 
            return this.evaluate( equation, { 
                temporaryVariable : variable,
                currentValue : current
            } ) + accumulator;
        }, 0 );
    }

    product( equation, rangeByVariable ) { 
        const { variable = null, value = null } = this.extract( rangeByVariable );
        if ( !variable || !value ) return NaN;
        const range = this.getRange( value );
        return range.reduce( ( accumulator, current ) => { 
            return thisthis.evaluate( equation, { 
                temporaryVariable : variable,
                currentValue : current
            } ) * accumulator;
        }, 0 );
    }
}