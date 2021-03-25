const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );
const roles = require( "@util/roles.json" );

module.exports = class RoleCommand extends Command {
    constructor( bot ) {
        super( bot, { 
            name : "role",
            aliases : [ "r" ],
            argsType : "multiple",
            memberName : "role",
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
        console.log( guild, member );

        const user = message.mentions.users.first( );
        const member = guild.member( user );

        let roleName = args.slice( 1 );

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

        const role = guild.roles.cache.find( r => r.name === roleName );

        if ( member.roles.cache.has( role.id ) ) { 
            return message.reply( `${user.tag} already has that role!` )
        }

        if ( !role ) return message.reply( "the role is not found." );

        member
            .roles
            .add( role )
            .then( ( ) => message.reply( `the role (${roleName}) has been added! Enjoy.` ) )
            .catch( ( ) => message.channel.send( `Error adding role: ${roleName}` ) );
    }
}