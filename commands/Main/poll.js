import Discord from "discord.js";

export default { 
    /**
     * @property {string} name
     */
    name : "poll",
    /**
     * @property {Array<string>} aliases
     */
    aliases : [ "makepoll" ],
    /**
     * @param {Object} obj
     * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} obj.channel
     * @param {Discord.Message} obj.msg
     * @param {Discord.Guild} obj.guild
     */
    async run( { channel, args, msg, guild } ) { 

        const embed = new Discord.MessageEmbed( { 
            title : "Poll"
        } );

        if ( args.length === 0 ) { 

            embed
                .setColor( 0xd30000 )
                .setDescription( "A question is required to initialize the poll." );

            return await channel.send( { embed } );
        } else {

            const q = args.join( " " ).trim( );

            const support = guild.emojis.cache.find( x => x.name === "support" );

            const neutral = guild.emojis.cache.find( x => x.name === "neutral" );

            const oppose = guild.emojis.cache.find( x => x.name === "oppose" );

            embed
                .setColor( 0x3a67cd )
                .setDescription( q )
                .addFields( [ 
                    { name : "Support", value : support, inline : true },
                    { name : "Neutral", value : neutral, inline : true },
                    { name : "Oppose", value : oppose, inline : true }
                ] );
            
            return await channel.send( { embed } ).then( ( message ) => { 
                
                const reactionOrder = [ support, neutral, oppose ];

                reactionOrder.forEach( ( reaction ) => message.react( reaction ) );

                msg.delete( 5000 ).catch( console.warn );
                
            } );
        }
    }
};