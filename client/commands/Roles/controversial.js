const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class ControversialCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "controversial",
            aliases : [ "political", "tea" ],
            argsType : "single",
            memberName : "controversial",
            group : "roles",
            description : 'This is a shorthand command for `$role Controversial`.'
        } );
    }

    /**
     * @param {Message} message
     * @param {string} name
     * @returns {Promise<any>}
     */
    async run( message ) { 
        const { guild, member } = message;

        const role = guild.roles.cache.find( r => r.name.toLowerCase( ) === "controversial" );

        if ( member.roles.cache.has( role.id ) ) { 
            return message.reply( "you already have the Controversial role." );
        }

        return member
            .roles
            .add( role )
            .then( ( ) => message.reply( "the role (Controversial) has been added! Enjoy." ) )
            .catch( e => { 
                console.log( e );
                return message.channel.send( "Error adding role: Controversial" );
            } );
    }
}