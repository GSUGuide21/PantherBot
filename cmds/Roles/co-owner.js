const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );

module.exports = class AdminCommand extends Command { 
    constructor( bot ) { 
        super( bot, { 
            name : "co-owner",
            aliases : [ "co" ],
            memberName : "co-owner",
            group : "roles",
            description : "Shorthand command for $role Co-Owner"
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
                .reply( "specify a user to give a co-owner role to." )
                .finally( ( ) => { 
                    if ( message.deletable ) message.delete( );
                } );
        }

        const member = guild.member( user );

        const coRole = guild.roles.cache.find( n => n.name.toLowerCase( ) === "co-owner" );

        if ( !coRole ) { 
            return message
                .reply( "the co-owner role has not been found." )
                .finally( ( ) => { 
                    if ( message.deletable ) message.delete( );
                } );
        }

        if ( member.roles.cache.has( coRole.id ) ) { 
            return message
                .reply( "the co-owner role has already been given." )
                .finally( ( ) => { 
                    if ( message.deletable ) message.delete( );
                } );
        }

        member
            .roles
            .add( coRole )
            .then( ( ) => message.reply( `the co-owner role has been given to ${member?.displayName || member?.user?.name}` ) )
            .catch( ( e ) => {
                console.log( e );
                return message.channel.send( `Error adding the co-owner role.` ) 
            } )
            .finally( ( ) => { 
                if ( message.deletable ) message.delete( );
            } );
    }
}