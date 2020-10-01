import Discord from "discord.js";
import fs from "fs-extra";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname( fileURLToPath( import.meta.url ) );

export default class RoleManager { 
    constructor( { channel } ) { 
        if ( new.target !== RoleManager ) { 
            return new RoleManager( );
        }
        this.__roleData = { };
        this.__roles = [ ];
        this.__cache = [ ];
        this.__loaded = false;
        this.init( { channel } );
    }

    async __getRoles( ) { 
        return await fs.readJSON( `${ __dirname }/roles.json` );
    }

    async __setRoles( ) { 
        const roles = await this.__getRoles( );
        Object.keys( roles ).forEach( ( role ) => {
            const roleObj = roles[ role ]; 
            this.__roles.push( role );
            this.__roleData[ role ] = roleObj;
        } );
    }

    init( { channel } ) { 
        this.__setRoles( )
            .then( ( ) => { 
                this.__loaded = true;
            } )
            .catch( ( e ) => { 
                channel.send( `The roles.json file has not been found. Reason: ${ e }.` );
            } );
    }

    async isLoaded( ) { 
        return await new Promise( ( res, rej ) => { 
            if ( this.__loaded ) { 
                res( );
            } else {
                rej( );
            }
        } );
    }

    add( roleName, { channel, guild, msg, member } ) { 
        this.isLoaded( )
            .then( ( ) => { 
                const role = this.getRole( roleName );
                if ( role === null ) return channel.send( "This role does not exist!" );
                const { id, name, restricted = false, canPromote = [ ] } = role;
                const targetMember = msg.mentions.members.first( );
                const m = targetMember || member;
                const { roles } = m;
                const { roles : guildRoles } = guild;
                const roleObj = guildRoles.cache.find( x => x.id === id );
                if ( restricted ) { 
                    if ( canPromote.includes( id ) ) { 
                        if ( roles.has( id ) ) return channel.send( `This user already has the following role: ${ name }!` );
                        roles.add( roleObj );
                    } else { 
                        return channel.send( `You do not have permission to promote this user to ${ name }.` );
                    }
                } else {
                    if ( roles.has( id ) ) return channel.send( `This user already has the following role: ${ name }!` );
                    roles.add( roleObj );
                }
            } )
            .catch( ( ) => { 
                
            } );
    }

    remove( roleName, { channel, guild, msg, member } ) {
        this.isLoaded( )
            .then( ( ) => {  
                const role = this.getRole( roleName );
                if ( role === null ) return channel.send( "This role does not exist!" );
                const { id, name, restricted = false, canPromote = [ ] } = role;
                const targetMember = msg.mentions.members.first( );
                const m = targetMember || member;
                const { roles } = m;
                const { roles : guildRoles } = guild;
                const roleObj = guildRoles.cache.find( x => x.id === id );
                if ( restricted ) { 
                    if ( canPromote.includes( id ) ) { 
                        if ( !roles.has( id ) ) return channel.send( `This user does not have the following role: ${ name }!` );
                        roles.remove( roleObj );
                    } else { 
                        return channel.send( `You do not have permission to demote this user to ${ name }.` );
                    }
                } else {
                    if ( !roles.has( id ) ) return channel.send( `This user does not have the following role: ${ name }!` );
                    roles.remove( roleObj );
                }
            } );
    }

    getRole( roleName ) { 
        const roleKeys = Object.keys( this.__roleData );
        const roleIndex = roleKeys.findIndex( ( k ) => { 
            if ( roleName === k ) return true;
            const roleItem = this.__roleData[ k ];
            const { id, name, aliases = [ ] } = roleItem;
            if ( aliases && aliases.length ) { 
                return aliases.include( roleName );
            }
            return ( roleName === id ) || ( roleName === name );
        } );
        if ( roleIndex === -1 ) return null;
        const roleKey = roleKeys[ roleIndex ];
        return this.__roleData[ roleKey ];
    }
}