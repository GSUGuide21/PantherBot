import questions from "./question-actions";

export default class Question { 
    constructor( text ) { 
        if ( new.target !== Question ) { 
            return new Question( text );
        }
        this.text = text;
        this.dispatched = false;
    }

    async parse( ) { 
        const { text } = this;
        const keys = Object.keys( questions );

        let r = null, o = { }, dispatch = false;

        while ( keys.length ) { 
            const key = keys.shift( );
            const response = responses[ key ];
            const { ask, generator, result } = response;

            const triggerIsArray = Array.isArray( ask );
            const triggerIsPattern = Object( ask ) instanceof RegExp;
            const triggerIsString = typeof ask === "string";
            const triggerIsFunction = typeof ask === "function";

            if ( triggerIsArray ) { 
                dispatch = ask.flat( Infinity ).some( ( s ) => { 
                    const isPattern = Object( s ) instanceof RegExp;
                    const isString = typeof s === "string";
                    const isFunction = typeof s === "function";

                    if ( isPattern ) { 
                        return s.test( text );
                    } else if ( isString ) {
                        return s === text;
                    } else if ( isFunction ) {
                        return s( { content : text } );
                    } else return false;
                } );
            } else if ( triggerIsString ) { 
                dispatch = ask === text;
            } else if ( triggerIsPattern ) { 
                dispatch = ask.test( text );
            } else if ( triggerIsFunction ) { 
                dispatch = ask( { content : text } );
            }

            if ( dispatch ) { 
                r = result;
                o.result = r;
                if ( generator ) { 
                    o.generator = generator;
                }
                break;
            }
        }

        return o;
    }

    send( { channel, msg, args, guild } ) { 
        const parse = this.parse( );
        return parse.then( ( o ) => { 
            if ( !o.hasOwnProperty( "result" ) ) return;
            const p = { channel, msg, args, guild };
            if ( o.hasOwnProperty( "generator" ) ) { 
                const { text } = this;
                const { generator } = o;
                const value = generator( { content : text } );
                p.result = value ? value : "";
            }
            const { result } = o;
            result( p );
            this.dispatched = true;
        } );
    }

    static parse( text ) {
        return new Question( text );
    }
}