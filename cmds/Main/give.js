const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );
const roles = require( "@util/roles.json" );

module.exports = class GiveRoleCommand extends Command {
    constructor( bot ) {
        super( bot, { 
            name : "give",
            aliases : [ "give-role", "g", "gr" ],
            argsType : "multiple",
            memberName : "give",
            group : "main",
            description : "Similar to the **role** command; however, it gives another member a role.",
            userPermissions : [ "MANAGE_ROLES" ],
            clientPermissions : [ "MANAGE_ROLES" ]
        } );
    }

    /**
     * @param {Message} message
     * @param {string[]} args
     * @returns {Promise<any>}
     */
    async run( message, args ) {
        const { guild } = message;

        const user = message.mentions.users.first( );
        const member = guild.member( user );

        let roleName = args.slice( 1 ).join( " " );

        for ( const [ canonicalRoleName, options ] of Object.entries( roles ) ) { 
            const names = [ canonicalRoleName, ...( Array.isArray( options.aliases ) ? options.aliases : ( [ options.aliases || "" ] ) ) ];
            const ciMatchRole = names
                .filter( string => string !== "" )
                .some( currentName => roleName.toLowerCase( ) === currentName.toLowerCase( ) );
            
            if ( ciMatchRole ) { 
                roleName = canonicalRoleName;
                break;
            }
        }

        if ( !roleName ) return message.reply( "please specify a role to give!" );

        const role = guild.roles.cache.find( r => r.name.toLowerCase( ) === roleName.toLowerCase( ) );

        if ( member.roles.cache.has( role.id ) ) { 
            return message.reply( `${user.tag} already has that role!` )
        }

        if ( !role ) return message.reply( "the role is not found." );

        console.log( role );

        member
            .roles
            .add( role )
            .then( ( ) => message.reply( `the role (${roleName}) has been added! Enjoy.` ) )
            .catch( ( e ) => {
                console.log( e );
                return message.channel.send( `Error adding role: ${roleName}` ) 
            } );
    }
}