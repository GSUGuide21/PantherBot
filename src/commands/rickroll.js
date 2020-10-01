import { MessageEmbed } from "discord.js";

export default { 
    aliases : [ "rr" ],
    category : "Random",
    description : "Sends a YouTube embed to Rick Astley\'s *Never Gonna Give You Up*.",
    async run( { channel } ) { 
        const embed = new MessageEmbed( );
        const authorImage = "https://yt3.ggpht.com/a/AATXAJy4EOYqoWGNS5eqtj0mc0C16I7U-s5cyZkkK5RI_Q=s48-c-k-c0xffffffff-no-nd-rj";
        const authorURL = "https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw";
        embed
            .setColor( "#9d0000" )
            .setAuthor( "Official Rick Astley", authorImage, authorURL )
            .setURL( "https://www.youtube.com/watch?v=dQw4w9WgXcQ" )
            .setImage( "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" )
            .setTitle( "Rick Astley - Never Gonna Give You Up (Video)" )
            .addFields( [ 
                {
                    name : "Video created",
                    value : "Oct. 25, 2009",
                    inline : true
                },
                { 
                    name : "Released",
                    value : "June 27, 1987",
                    inline : true
                },
                { 
                    name : "Writers",
                    value : "Pete Waterman, Mike Stock, Matt Aitken"
                }
            ] );
        return await channel.send( { embed } );
    }
};