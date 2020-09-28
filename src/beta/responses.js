import responses from "./response-actions.js";

export default class TextResponse { 
    constructor( text ) { 
        if ( new.target !== TextResponse ) { 
            return new TextResponse( text );
        }
        this.text = text;
        this.dispatched = false;
    }

    async parse( ) { 
        const { text } = this;
        const keys = Object.keys( responses );

        let r = null, o = { }, dispatch = false;

        while ( keys.length ) { 
            const key = keys.shift( );
            const response = responses[ key ];
            const { trigger, result } = response;

            const triggerIsArray = Array.isArray( trigger );
            const triggerIsPattern = Object( trigger ) instanceof RegExp;
            const triggerIsString = typeof trigger === "string";
            const triggerIsFunction = typeof trigger === "function";

            if ( triggerIsArray ) { 
                dispatch = trigger.flat( Infinity ).some( ( s ) => { 
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
                dispatch = trigger === text;
            } else if ( triggerIsPattern ) { 
                dispatch = trigger.test( text );
            } else if ( triggerIsFunction ) { 
                dispatch = trigger( { content : text } );
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

        if ( r === null ) { 
            return { };
        } else { 
            return { result : r };
        }
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
        return new TextResponse( text );
    }
};