import fs from "fs";
import axios from "axios";
import Discord from "discord.js";

const QUESTION_SUFFIX = "?";

export default [ 
    { 
        ask( { content, channel } ) { 
            if ( !content.endsWith( QUESTION_SUFFIX ) ) return false;
            return this.trigger( { content, channel } );
        },
        trigger( { content } ) { 
            const prefix = "PantherBot, can you play (.+)\\?";
            const pattern = new RegExp( `^${ prefix }$`, "gim" );
            return content.test( pattern );
        },
        result( { content, channel } ) { 
            const pattern = new RegExp( `^${ prefix }$`, "gim" );
            content.replace( pattern, ( match, track ) => { 
                const m = "";
            } );
        }
    }
];