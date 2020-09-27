import Discord from "discord.js";
import axios from "axios";
import fs from "fs-extra";
import ytdl from "ytdl-core";

export default { 
    // Integral commands
    signal( { channel } ) { 
        const embed = new Discord.MessageEmbed( );
    },
    help( { } ) { },
    // Music commands
    play( { } ) { },
    // Random commands
    whois( { } ) { },
    info( { } ) { },
    binary( { } ) { },
    random( { } ) { },
    fibonacci( { } ) { },
    // Moderator commands
    mute( { channel, msg, args, guild } ) { 

    },
    kick( { channel, msg, args, guild } ) {
        const user = msg.mentions.user.first( );
        if ( user ) { 
            const member = guild.member( user );
            if ( member ) { 
                const reason = args.slice( 1 ).join( " " ).trim( );
                member.kick( reason ).then( ( ) => { 
                } ).catch( ( e ) => { 
                    console.log( e );
                    channel.send( "You are unable to kick that person." );
                } );
            } else { 
                channel.send( "The user you are attempting to kick is not in this server." );
            }
        } else { 
            channel.send( "You need to specify a user to kick." );
        }
    },
    ban( { channel, msg, args, guild } ) { 
        const user = msg.mentions.user.first( );
        if ( user ) { 
            const member = guild.member( user );
            if ( member ) { 
                const reason = args.slice( 1 ).join( " " ).trim( );
                member.ban( { reason } ).then( ( ) => { 
                } ).catch( ( e ) => { 
                    console.log( e );
                    channel.send( "You are unable to kick that person." );
                } );
            } else { 
                channel.send( "The user you are attempting to kick is not in this server." );
            }
        } else { 
            channel.send( "You need to specify a user to ban." );
        }
    }
};