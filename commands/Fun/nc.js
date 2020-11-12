import Discord from "discord.js";

export default { 
    /**
     * @property {string} name
     */
    name : "nc",
    /**
     * @property {Array<string>} aliases
     */
    aliases : [ "nobodycares" ],
    /**
     * @param {Object} obj
     * @param {Discord.TextChannel|Discord.NewsChannel|Discord.DMChannel} obj.channel
     */
    async run( { channel } ) { 

        const embed = new Discord.MessageEmbed( { 
            color : 0x999999,
            image : "https://images.uncyclomedia.co/uncyclopedia/en/thumb/f/f8/Nojesus.jpg/400px-Nojesus.jpg",
            title : "Nobody cares.",
            url : "https://en.uncyclopedia.co/wiki/Nobody_cares",
            description : "Nobody cares is a policy employed by dictators, despots, democracy, the general public, and the wiki administration. It would be considered the largest epidemic facing the world today if it weren't for the fact that nobody gives a flying cow about epidemics."
        } );

        return await channel.send( { embed } );
    }
};