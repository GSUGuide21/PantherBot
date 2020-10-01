import { MessageEmbed } from "discord.js";
import slug from "./slug.js";

export default { 
    aliases : [ "gsusignal" ],
    acceptedArgs : [ "title" ],
    category : "Main",
    description : "Sends a link to an article from The Signal.",
    handleArgs( args ) { 
        return args.join( " " );
    },
    async run( { channel, args } ) { 
        const embed = new MessageEmbed( );
        const { title } = args;
        const slugged = slug( title );
        const url = `https://www.georgiastatesignal.com/${ slugged }`;
        const signalImg = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";
        const signalURL = "https://www.georgiastatesignal.com";
        embed
            .setAuthor( "The Signal", signalImg, signalURL )
            .setColor( "#35bfef" )
            .setTitle( title )
            .setURL( url );
        return channel.send( { embed } );
    }
};