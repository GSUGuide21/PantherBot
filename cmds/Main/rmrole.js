const { Command } = require( "discord.js-commando" );
const { Message } = require( "discord.js" );
const roles = require( "@util/roles.json" );

module.exports = class RemoveRoleCommand extends Command {
    constructor( bot ) {
        super( bot, { 
            name : "rmrole",
            aliases : [ "remove-role", "rmr", "unrole" ],
            argsType : "single",
            memberName : "rmrole",
            group : "main",
            description : "Removes a role from a member in the Discord server"
        } );
    }

    /**
     * @param {Message} message
     * @param {string} name
     * @returns {Promise<any>}
     */
    async run( message, name ) {
        const { guild, member } = message;
        console.log( guild, member );
        
        if ( !name ) return message.reply( "please specify a role to receive!" );

        for ( const [ roleName, options ] of Object.entries( roles ) ) { 
            const names = [ roleName, ...( Array.isArray( options.aliases ) ? options.aliases : ( [ options.aliases || "" ] ) ) ];
            const ciMatchRole = names
                .filter( string => string !== "" )
                .some( currentName => name.toLowerCase( ) === currentName.toLowerCase( ) );
            
            if ( ciMatchRole ) { 
                const role = guild.roles.cache.find( r => r.name.toLowerCase( ) === roleName.toLowerCase( ) );

                if ( !member.roles.cache.has( role.name ) ) {
                    return message.reply( `you do not have that role (${roleName}).` );
                }

                return member
                    .roles
                    .remove( role )
                    .then( ( ) => message.reply( `the role (${roleName}) has been removed! Enjoy.` ) )
                    .catch( ( ) => message.channel.send( `Error adding role: ${roleName}` ) );
            }
        }

        return reply( "the role is not found." );
    }
}