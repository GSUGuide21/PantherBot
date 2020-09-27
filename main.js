/**
 * @name        PantherBot
 * @version     1.0.1
 * @author      GSUGuide21
 **/

// Discord.js
const Discord = require( "discord.js" );

// dotenv
const dotenv = require( "dotenv" );

// Responses
const responses = require( `./src/responses` );

// Commands
const commands = require( "./src/commands" );

// Messages
const messages = require( "./src/messages" );

// Roles
const roles = require( "./src/roles" );

// Create date function
const createDate = require( "./src/date" );

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
        if ( typeof commands[ CMD_NAME ] === "function" ) { 
            const command = commands[ CMD_NAME ];
            const args = CMD_ARGS.filter( x => x !== "" );
            command( { channel, msg, args, guild } );
        } else if ( typeof commands[ CMD_NAME ] === "string" ) { 
            channel.send( commands[ CMD_NAME ] );
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
            const { trigger, result } = question;
            const toTrigger = trigger( { channel, msg, content, author, guild } );
            if ( toTrigger ) { 
                result( { channel, msg, content, author, guild } );
                responded = true;
            }
        } );
    }
} );

bot.on( "message", msg => { 
    const { content, author, channel } = msg;
    if ( author.bot ) return;
    if ( content.startsWith( PREFIX ) ) {
        const [ CMD_NAME, ...args ] = content
            .trim( )
            .substring( PREFIX.length )
            .split( /\s+/g );
        if ( typeof Commands[ CMD_NAME ] === "function" ) {
            const command = Commands[ CMD_NAME ];
            command( { channel, msg, args } );
        }
    } else { 
        let responded = false;
        responses.forEach( response => { 
            if ( responded ) return false;
            const { ask, result } = response;
            if ( ask( { channel, msg, content, author } ) ) {
                result( { channel, msg, content, author } );
            }
        } );

        /*questions.forEach( questions => { 
            if ( responded ) return false;
        } );*/
    }
} );

bot.on( "guildMemberAdd", member => { 
    const { guild, user } = member;
    const { channels } = guild;
    const updateChannel = channels.find( c => c.name === "update" );
    const lobbyChannel = channels.find( c => c.name === "lobby" );

    if ( updateChannel ) {
        const embed = new Discord.MessageEmbed( );
        embed
            .setColor( "#374057" )
            .setThumbnail( user.avatarURL )
            .setTitle( "User Information" )
            .addFields( [ 
                { 
                    name : "Nickname",
                    value : user.username
                },
                { 
                    name : "Tag",
                    value : user.tag
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