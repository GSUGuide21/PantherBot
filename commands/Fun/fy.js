import Discord from "discord.js";

export default { 
    /**
     * @property {string} name
     */
    name : "fy",
    /**
     * @param {Object} obj
     * @param {Discord.Message} obj.msg
     */
    async run( { msg } ) {
        return msg.reply( "fuck you!" );
    }
};