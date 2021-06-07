const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class AdminCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "admin",
            aliases : [ "administrator" ],
            memberName : "admin",
            group : "roles",
            description : "Shorthand command for $role Admin"
        } );
    }

    /**
     * @param {Message} message
     * @param {string} name
     */
    async run( message ) { 
        const { guild } = message;

        const user = message.mentions.users.first( );
        
        if ( !user ) { 
            return message
                .reply( "specify a user to give an admin role to." )
                .finally( ( ) => { 
                    if ( message.deletable ) message.delete( );
                } );
        }

        const member = guild.member( user );

        const adminRole = guild.roles.cache.find( n => n.name.toLowerCase( ) === "admin" );

        if ( !adminRole ) { 
            return message
                .reply( "the admin role has not been found." )
                .finally( ( ) => { 
                    if ( message.deletable ) message.delete( );
                } );
        }

        if ( member.roles.cache.has( adminRole.id ) ) { 
            return message
                .reply( "the admin role has already been given." )
                .finally( ( ) => { 
                    if ( message.deletable ) message.delete( );
                } );
        }

        member
            .roles
            .add( adminRole )
            .then( ( ) => message.reply( `the admin role has been given to ${member?.displayName || member?.user?.name}` ) )
            .catch( ( e ) => {
                console.log( e );
                return message.channel.send( `Error adding the admin role.` ) 
            } )
            .finally( ( ) => { 
                if ( message.deletable ) message.delete( );
            } );
    }
}