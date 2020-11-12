import Discord from "discord.js";

export default {
    /**
     * @property {string} name
     */
    name : "test",
    /**
     * @param {Object} obj 
     * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} obj.channel
     */ 
    async run( { channel } ) { 
        return await channel.send( "Test completed" );
    }
};