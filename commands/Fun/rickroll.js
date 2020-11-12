import Discord from "discord.js";

export default { 
    /**
     * @property {string} name
     */
    name : "rickroll",
    /**
     * @property {Array<string>} aliases
     */
    aliases : [ "rr" ],
    /**
     * @method run
     * @param {Object} obj
     * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} obj.channel
     */
    async run( { channel } ) {

        const embed = new Discord.MessageEmbed( { 
            color : 0x9d0000,
            author : {
                name : "Official Rick Astley",
                iconURL : "https://yt3.ggpht.com/a/AATXAJy4EOYqoWGNS5eqtj0mc0C16I7U-s5cyZkkK5RI_Q=s48-c-k-c0xffffffff-no-nd-rj",
                url : "https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw"
            },
            url : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            image : "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            title : "Rick Astley - Never Gonna Give You Up (Video)",
            fields : [ 
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
            ]
        } );

        return await channel.send( { embed } );
    } 
}