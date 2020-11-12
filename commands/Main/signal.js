import Discord from "discord.js";

/**
 * @param {string} s 
 */
function slug( s ) { 
    const r = String( s )
        .toLowerCase( )
        .replace( /\s+/g, "-" )
        .replace( /[^\u0100-\uFFFF\w\-]/g, '-' )
        .replace( /\-\-+/g, "-" )
        .replace( /^-+/, "" )
        .replace( /-+$/g, "" );
    return r;
}

export default { 
    /**
     * @property {string} name
     */
    name : "signal",
    /**
     * @property {Array<string>} aliases
     */
    aliases : [ "gsusignal" ],
    /**
     * @param {Array<string>} args 
     */
    handleArgs( args ) { 
        args.title = args[ 0 ];
        return args;
    },
    /**
     * @param {Object} obj
     * @param {Discord.TextChannel|Discord.DMChannel|Discord.TextChannel} obj.channel
     * @param {Array<string>} obj.args
     */
    async run( { channel, args } ) { 

        const { title } = args;

        const slugged = slug( title );

        const url = `https://www.georgiastatesignal.com/${ slugged }`;

        const signalImg = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";

        const signalUrl = "https://www.georgiastatesignal.com";

        const embed = new Discord.MessageEmbed( { 
            author : { 
                name : "The Signal",
                iconURL : signalImg,
                url : signalUrl
            },
            color : 0x35bfef,
            url,
            title
        } );

        return await channel.send( { embed } );
    }
}