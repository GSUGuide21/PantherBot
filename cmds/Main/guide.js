const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class GuideCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "guide",
            aliases : [ "gsu-guide", "gsu" ],
            argsType : "single",
            memberName : "guide",
            group : "main",
            description : 'This is a shorthand command for `$role Guide`.'
        } );
    }

    /**
     * @param {Message} message
     * @param {string} name
     * @returns {Promise<any>}
     */
    async run( message ) { 
        const { guild, member } = message;

        const role = guild.roles.cache.find( r => r.name.toLowerCase( ) === "guide" );

        if ( member.roles.cache.has( role.id ) ) { 
            return message.reply( "you already have the Guide role." );
        }

        return member
            .roles
            .add( role )
            .then( ( ) => message.reply( "the role (Guide) has been added! Enjoy." ) )
            .catch( e => { 
                console.log( e );
                return message.channel.send( "Error adding role: Guide" );
            } );
    }
}