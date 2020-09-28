import Discord from "discord.js";
import axios from "axios";
import fs from "fs-extra";
import ytdl from "ytdl-core";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname( fileURLToPath( import.meta.url ) );

export default { 
    majors : {
        trigger : /^What majors do (.*) have$/im,
        handler( { content } ) { 
            const x = this.trigger.exec( content );
            const [ , v ] = x;
            return v;
        },
        result( { channel, result } ) { 
            fs.readJSON( `${ __dirname }/colleges.json` ).then( ( data ) => { 
                const searchAliases = ( o ) => { 
                    if ( o.hasOwnProperty( result ) ) {
                        return result;
                    }
                    const keys = Object.keys( o );
                    const index = keys.findIndex( ( k ) => { 
                        const v = o[ k ];
                        const { aliases = [ ] } = v;
                        return aliases.includes( result );
                    } );
                    if ( index === -1 ) { 
                        return null;
                    }
                    const name = keys[ index ];
                    return name;
                };
                const college = searchAliases( data );
                const { majors } = college;

                channel.send( majors.join( ", " ) );
            } );
        }
    },
    majorcount : { 
        trigger : /^How many majors does (.*) have$/im,
        handler( { content } ) { 
            const x = this.trigger.exec( content );
            const [ , v ] = x;
            return v;
        },
        result( { channel, result } ) { 
            fs.readJSON( `${ __dirname }/colleges.json` ).then( ( data ) => { 
                const searchAliases = ( o ) => { 
                    if ( o.hasOwnProperty( result ) ) {
                        return result;
                    }
                    const keys = Object.keys( o );
                    const index = keys.findIndex( ( k ) => { 
                        const v = o[ k ];
                        const { aliases = [ ] } = v;
                        return aliases.includes( result );
                    } );
                    if ( index === -1 ) { 
                        return null;
                    }
                    const name = keys[ index ];
                    return name;
                };
                const college = searchAliases( data );
                const { majors } = college;

                channel.send( majors.join( ", " ) );
            } );
        }
    }
};