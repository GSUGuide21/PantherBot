import Discord, { DataResolver } from "discord.js";

/**
 * @param {Discord.Collector} collector 
 */
async function fetchPollOptions( collector ) { 
    return await new Promise( ( res, rej ) => { 
        collector.on( "end", ( collected ) => { 
            res( collected.map( m => m.content ) );
        } );
    } );
}

export default {
    /**
     * @property {string} name
     */
    name : "p",
    /**
     * @property {Array<string>} aliases
     */
    aliases : [ "createpoll", "pollcreate" ],
    /**
     * @param {Object} obj
     * @param {Discord.Message} obj.msg
     * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} obj.channel
     * @param {Discord.User} obj.author
     * @param {Array<string>} obj.args
     */
    async run( { msg, channel, args, author } ) { 

        const limit = Math.max( 0, Math.min( args[ 0 ], 15 ) );

        const embed = new Discord.MessageEmbed( { 
            title : "Poll",
            color : 0x786511,
            description : `You can create a maximum of ${limit} poll options!`
        } );

        channel.send( { embed } );

        /**
         * @param {Discord.Message} m 
         */
        const filter = ( m ) => { 
            if ( m.author.id === author.id ) { 
                if ( m.content.toLowerCase( ) === "--done" ) {
                    collector.stop( );
                } else { 
                    return true;
                }
            } else return false;
        };

        const collector = channel.createMessageCollector( filter, { max : limit } );

        const pollOptions = await fetchPollOptions( collector );
    }
}