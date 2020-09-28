import Discord from "discord.js";
import axios from "axios";
import fs from "fs-extra";
import ytdl from "ytdl-core";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname( fileURLToPath( import.meta.url ) );

export default { 
    hello : { 
        trigger : /^Hello\,\s*PantherBot!?$/im,
        result : ( { msg } ) => msg.reply( "hello!" )
    },
    roll : { 
        trigger : [
            /^PantherBot\,\s*roll (?:the dice|a die)!?$/im,
            /^Roll (?:the dice|a die)\,\s*PantherBot!?$/im
        ],
        result : ( { channel } ) => { 
            let a = [ 1, 2, 3, 4, 5, 6 ];
            let r = Math.floor( Math.random( ) * a.length );
            channel.send( `PantherBot rolled a ${ a[ r ] }` );
        }
    },
    coin : { 
        trigger : [
            /^PantherBot\,\s*(?:heads or tails\?|flip a coin!)$/im,
            /^(?:Heads or tails|Flip a coin)\,\s*PantherBot$/im
        ],
        result : ( { channel } ) => { 
            const a = [ "heads", "tails" ];
            let r = Math.floor( Math.random( ) * a.length );
            channel.send( `PantherBot flipped a coin and got ${ a[ r ] }` );
        }
    },
    riddle : { 
        trigger : [ 
            /^PantherBot\,\s*(?:send|give) (?:us |me |)a riddle!?$/im,
            /^(?:Give|send) (?:us |me |)a riddle!?/im
        ],
        result : ( { channel } ) => { 
            fs.readFile( `${ __dirname }/riddles.txt`, 'utf-8', ( err, data ) => { 
                if ( err ) { 
                    channel.send( "I don't have any riddles to tell you today." );
                } else { 
                    const pattern = /^\*\s*(.+)$/gm;
                    const riddles = [ ];
                    
                    while ( ( v = pattern.exec( data ) ) ) {
                        const [ , res ] = v;
                        riddles.push( res.trim( ) );
                    }

                    const { length } = riddles;
                    const index = Math.floor( Math.random( ) * length );

                    const r = riddles[ index ];
                    channel.send( r );
                }
            } );
        }
    },
    fy : { 
        trigger : [ 
            /^Fuck you\,\s*PantherBot!?$/im,
            /^PantherBot\,\s*fuck you!?$/im
        ],
        result : ( { msg } ) => {
            msg.reply( "fuck you too!" );
        }
    }
};