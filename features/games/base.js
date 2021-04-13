const { MessageEmbed } = require( "discord.js" );
const { Client } = require( "discord.js-commando" );

/**
 * @typedef {object} GameOptions
 * @property {boolean} useEmbed
 */
module.exports = class Game { 
    static #GAMES = { };

    #STAGES = { };
    /**
     * Creates a base game object
     * @param {Client} bot
     * @param {GameOptions} options 
     */
    constructor( bot, options = { } ) { 
        const { 
            useEmbed = false
        } = options;

        this.inGame = false;
        
        this.bot = bot;
        this.useEmbed = useEmbed;
        this.embed = null;
        
        if ( this.useEmbed ) this.embed = new MessageEmbed( );
    }
}