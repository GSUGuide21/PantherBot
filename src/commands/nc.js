import { MessageEmbed } from "discord.js";

export default { 
    aliases : [ "nobodycares" ],
    category : "Random",
    run( { channel } ) { 
        const embed = new MessageEmbed( );
        embed
            .setColor( "#999999" )
            .setImage( "https://images.uncyclomedia.co/uncyclopedia/en/thumb/f/f8/Nojesus.jpg/400px-Nojesus.jpg" )
            .setTitle( "Nobody cares." )
            .setURL( "https://en.uncyclopedia.co/wiki/Nobody_cares" )
            .setDescription( "Nobody cares is a policy employed by dictators, despots, democracy, the general public, and the wiki administration. It would be considered the largest epidemic facing the world today if it weren't for the fact that nobody gives a flying cow about epidemics." );
        return await channel.send( { embed } );
    }
};