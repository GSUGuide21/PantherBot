/**
 * @name        PantherBot
 * @version     1.0.1
 * @author      GSUGuide21
 **/

// Discord.js
import Discord from "discord.js";
// dotenv
import dotenv from "dotenv";
// Responses
import responses from "./src/responses.js";
// Commands
import Commands from "./src/commands.js";
// Messages
import { join, leave, ban, kick } from "./src/messages.js";
// Roles
import roles from "./src/roles.js";
// Create date function
import createDate from "./src/date.js";

// Configuring the environment variables
dotenv.config( );

console.log( "Initializing PantherBot!" );

const { Client } = Discord;
const bot = new Client( );
const { PANTHERBOT_TOKEN : token } = process.env;
const COMMAND_PREFIX = "!";

console.log( `PantherBot token: ${ token }` );

const { join } = messages;

bot.on( "ready", ( ) => { 
    const { user : { tag } } = bot;
    console.log( `${ tag } has connected to the group chat!` );
} );

bot.on( "message", ( msg ) => { 
    const { content, author, channel, guild } = msg;
    if ( author.bot ) return;
    if ( content.startsWith( COMMAND_PREFIX ) ) { 
        const [ CMD_NAME, ...CMD_ARGS ] = content
            .trim( )
            .substring( COMMAND_PREFIX.length )
            .split( /\s+/g );
        if ( typeof Commands[ CMD_NAME ] === "function" ) { 
            const command = Commands[ CMD_NAME ];
            const args = CMD_ARGS.filter( x => x !== "" );
            command( { channel, msg, args, guild } );
        } else if ( typeof Commands[ CMD_NAME ] === "string" ) { 
            channel.send( Commands[ CMD_NAME ] );
        }
    } else { 
        let responded = false;

        responses.forEach( ( response ) => { 
            if ( responded ) return false;
            const { trigger, result } = response;
            const toTrigger = trigger( { channel, msg, content, author, guild } );
            if ( toTrigger ) { 
                result( { channel, msg, content, author, guild } );
                responded = true;
            }
        } );

        questions.forEach( ( question ) => { 
            if ( responded ) return false;
            const { ask, result } = question;
            const toAsk = ask( { channel, msg, content, author, guild } );
            if ( toAsk ) { 
                result( { channel, msg, content, author, guild } );
                responded = true;
            }
        } );
    }
} );

bot.on( "guildMemberAdd", member => { 
    const { guild, user } = member;
    const { channels } = guild;
    const updateChannel = channels.find( c => c.name === "update" );
    const lobbyChannel = channels.find( c => c.name === "lobby" );

    if ( updateChannel ) {
        const embed = new Discord.MessageEmbed( );
        const { username, tag, avatarURL } = user;
        embed
            .setColor( "#374057" )
            .setThumbnail( avatarURL )
            .setTitle( "User Information" )
            .addFields( [ 
                { 
                    name : "Nickname",
                    value : username
                },
                { 
                    name : "Tag",
                    value : tag
                },
                { 
                    name : "Joined",
                    value : createDate( member.joinedAt )
                }
            ] );
        updateChannel.send( embed )
    }

    if ( lobbyChannel ) {
        join.send( { channel, user } );
    }
} );

bot.on( "guildMemberRemove", member => { 
    const { guild, user } = member;
    const { channels } = guild;
    const updateChannel = channels.find( c => c.name === "update" );
    const lobbyChannel = channels.find( c => c.name === "lobby" );

    if ( lobbyChannel ) { 
        leave.send( { channel, user } );
    }
} );

bot.on( "guildBanAdd", ( guild, user ) => { 

} );

bot.login( token );