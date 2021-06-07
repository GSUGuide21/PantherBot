const { MessageEmbed } = require("discord.js");
const { Command } = require( "discord.js-commando" );

module.exports = class RickrollCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "rickroll",
            aliases : [ "rr" ],
            memberName : "rickroll",
            group : "miscellaneous",
            description : "Sends an embed of Rick Astley's *Never Gonna Give You Up*"
        } );
    }

    async run( { channel } ) { 
        const embed = new MessageEmbed( { 
            color : 0x9d000,
            title : "Rick Astley - Never Gonna Give You Up (Video)",
            url : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image : { 
                url : "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
            },
            fields : [ 
				{
					name : "Video created",
					value : "October 25, 2009",
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
			],
            author : { 
                name : "Official Rick Astley",
				iconURL : "https://yt3.ggpht.com/a/AATXAJy4EOYqoWGNS5eqtj0mc0C16I7U-s5cyZkkK5RI_Q=s48-c-k-c0xffffffff-no-nd-rj",
				url : "https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw"
            }
        } );

        channel.send( { embed } );
    }
}