import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname( fileURLToPath( import.meta.url ) );

export default [ 
    // Hello, PantherBot
    { 
        trigger : ( { content } ) => { 
            const a = [ 
                "Hello, PantherBot",
                "Hello, PantherBot!",
                "Hello PantherBot",
                "Hello PantherBot!",
                "hello pantherbot",
                "hello PantherBot",
                "hello, pantherbot",
                "hello, pantherbot!"
            ];
            return a.includes( content );
        },
        result : ( { msg } ) => msg.reply( "Hello" )
    },
    // PantherBot, roll the dice!
    { 
        trigger : ( { content } ) => {
            const a = [ 
                "PantherBot, roll the dice!",
                "PantherBot, roll a die!",
                "Roll the dice, PantherBot!",
                "Roll a die, PantherBot!"
            ];
            return a.includes( content );
        },
        result : ( { channel } ) => { 
            let a = [ 1, 2, 3, 4, 5, 6 ];
            let r = Math.floor( Math.random( ) * a.length );
            let n = a[ r ];
            channel.send( n );
        }
    },
    // PantherBot, flip a coin!
    { 
        trigger : ( { content } ) => {
            const a = [ 
                "PantherBot, flip a coin!",
                "PantherBot, heads or tails?",
                "Flip a coin, PantherBot",
                "Heads or tails, PantherBot?"
            ];
            return a.includes( content );
        },
        result : ( { channel } ) => { 
            let a = [ "Heads", "Tails" ];
            let r = Math.floor( Math.random( ) * a.length );
            let n = a[ r ];
            channel.send( n );
        }
    },
    // PantherBot, give me a riddle!
    {
        trigger : ( { content } ) => { 
            const a = [ 
                "PantherBot, send us a riddle!",
                "PantherBot, give a riddle!",
                "PantherBot, give me a riddle!",
                "Give me a riddle, PantherBot!"
            ];
            return a.includes( content );
        },
        result : ( { channel } ) => {
            fs.readFile( `${ __dirname }/src/riddles.txt`, 'utf-8', ( err, data ) => { 
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
    }
];