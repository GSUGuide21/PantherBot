const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class NSFWCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "nsfw",
            aliases : [ "not-safe-for-work" ],
            argsType : "single",
            memberName : "nsfw",
            group : "main",
            description : 'This is a shorthand command for `$role NSFW`.'
        } );
    }

    /**
     * @param {Message} message
     * @param {string} name
     * @returns {Promise<any>}
     */
    async run( message ) { 
        const { guild, member } = message;

        const role = guild.roles.cache.find( r => r.name.toLowerCase( ) === "nsfw" );

        if ( member.roles.cache.has( role.id ) ) { 
            return message.reply( "you already have the NSFW role." );
        }

        return member
            .roles
            .add( role )
            .then( ( ) => message.reply( "the role (NSFW) has been added! Enjoy." ) )
            .catch( e => { 
                console.log( e );
                return message.channel.send( "Error adding role: NSFW" );
            } );
    }
}