import Discord from "discord.js";
import axios from "axios";
import fs from "fs-extra";
import ytdl from "ytdl-core";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname( fileURLToPath( import.meta.url ) );

const MAX_SAFE_INTEGER = Math.pow( 10, 10 ) - 1;
const SERVERS = { };

const slug = ( s ) => { 
    const r = String( s )
        .toLowerCase( )
        .replace( /\s+/g, "-" )
        .replace( /[^\u0100-\uFFFF\w\-]/g, '-' )
        .replace( /\-\-+/g, "-" )
        .replace( /^-+/, "" )
        .replace( /-+$/g, "" );
    return r;
};

const isNum = ( n ) => ( isFinite( n ) && !isNaN( n ) );

export default { 
    // Integral commands
    signal( { channel } ) { 
        const embed = new Discord.MessageEmbed( );
        const title = args.join( " " );
        const slugged = slug( title );
        const url = `https://www.georgiastatesignal.com/${ slugged }`;
        const signalImg = "https://s4844.pcdn.co/wp-content/uploads/2020/08/Signal-Logo-Signal-Blue-03.png";
        const signalURL = "https://www.georgiastatesignal.com";
        embed
            .setAuthor( "The Signal", signalImg, signalURL )
            .setColor( "#35bfef" )
            .setTitle( title )
            .setURL( url );
        channel.send( { embed } );
    },
    help( { channel } ) { 
        fs.readFile( `${ __dirname }/help.txt`, "utf-8", ( err, data ) => { 
            if ( err ) {
                console.log( err );
                return channel.send( "There is no command directory for this bot." );
            } else {
                console.log( data );
                channel.send( data );
            }
        } );
    },
    // Music commands
    play( { msg, channel, args } ) { 
        const { guild, member } = msg;
        
        if ( args.length === 0 ) {
            return channel.send( "A URL is required for music to play." );
        }

        if ( !member.voiceChannel ) {
            return channel.send( "This member must be in a voice channel to perform this command." );
        }

        if ( SERVERS[ guild.id ] ) SERVERS[ guild.id ] = { queue : [ ] };

        let [ url ] = args;
        let urlPattern = /^(?:https?\:\/\/|)(?:www\.youtube\.com\/watch\?v=|youtu\.be)([^&?\/:]+)/i;

        if ( !urlPattern.test( url ) ) {
            url = `https://www.youtube.com/watch?v=${ url }`;
        }

        if ( !urlPattern.test( url ) ) { 
            return channel.send( "This is not a valid YouTube link." );
        }

        const server = SERVERS[ guild.id ];
        server.queue.push( url );

        const play = ( connection, message ) => { 
            const s = SERVERS[ message.guild.id ];
            s.dispatcher = connection.playStream( ytdl( s.queue[ 0 ], { 
                filter : "audioonly"
            } ) );
            s.queue.shift( );
            s.dispatcher.on( "end", ( ) => { 
                if ( s.queue[ 0 ] ) {
                    play( connection, message );
                } else {
                    connection.disconnect( );
                }
            } );
        };

        if ( !guild.voiceConnection ) {
            member.voiceChannel.join( ).then( ( connection ) => { 
                play( connection, msg );
            } );
        }
    },
    skip( { channel, msg } ) { 
        const { guild } = msg;
        const server = SERVERS[ guild.id ];
        if ( server.dispatcher ) { 
            server.dispatcher.end( );
            channel.send( "Skipping to the next song!" );
        }
    },
    stop( { channel, msg } ) {
        const { guild } = msg;
        const server = SERVERS[ guild.id ];

        if ( guild.voiceConnection ) { 
            while ( server.queue.length ) { 
                server.queue.pop( );
            }
            server.dispatcher.end( );
            channel.send( "Ending the voice queue!" );
        }

        if ( guild.connection ) { 
            guild.voiceConnection.disconnect( );
        }
    },
    // Random commands
    yt( { channel, args } ) { 
        if ( args.length === 0 ) { 
            return channel.send( "A YouTube video ID or URL is required." );
        }
        const embed = new Discord.MessageEmbed( );
        const arg = args[ 0 ];
        const isYoutubeURL = /^(?:https?\:\/\/|)(?:www\.youtube\.com|youtu\.be)\/?/;

        let isWatchURL = true, videoID;
        if ( isYoutubeURL.test( arg ) ) { 
            const s = arg.replace( isYoutubeURL, "" );
            const isYbe = /^(?:https?\:\/\/|)youtu\.be/;

            if ( isYbe.test( arg ) ) {
                if ( !s ) return channel.send( "A YouTube video ID is required." );
                videoID = isYbe.split( /[\/?&]/g )[ 0 ];
                videoID = `https://www.youtube.com/watch?v=${ videoID }`;
            } else {
                const watchPrefix = /watch\?v=/;
                const r = s.replace( watchPrefix, "" );
                if ( !r ) return channel.send( "A YouTube video ID is required." );
                videoID = arg;
            }
        } else {
            isWatchURL = false;
        }
        const watchURL = isWatchURL ? videoID : `https://www.youtube.com/watch?v=${ videoID }`;
        console.log( watchURL );
        embed.setColor( "#dd0000" );
        const reqURL = new URL( "https://www.youtube.com/oembed" );
        reqURL.searchParams.append( "url", watchURL );
        reqURL.searchParams.append( "format", "json" );

        axios.get( reqURL.toString( ) ).then( response => { 
            const { data } = response;
            const { title, thumbnail_url, author_url, author_name } = data;
            const finalThumbnailURL = thumbnail_url.replace( /hqdefault\.jpg$/, "maxresdefault.jpg" );
            const authorInfo = [ "YouTube", "", "https://www.youtube.com" ];
            const fieldInfo = [
                [ "Creator", author_name, true ],
                [ "Creator URL", author_url, true ],
                [ "Video URL", watchURL ]
            ];
            embed
                .setTitle( title )
                .setAuthor( ...authorInfo )
                .setImage( finalThumbnailURL )
            fieldInfo.forEach( field => embed.addField( ...field ) );
            channel.send( { embed } );
        } ).catch( e => {
            console.error( e );
            channel.send( "Error loading data from YouTube." );
        } );
    },
    ping( { channel } ) { 
        channel.send( "pong!" );
    },
    fy( { msg } ) {
        msg.reply( `fuck you!` );
    },
    rickroll( { channel } ) { 
        const embed = new Discord.MessageEmbed( );
        const authorImage = "https://yt3.ggpht.com/a/AATXAJy4EOYqoWGNS5eqtj0mc0C16I7U-s5cyZkkK5RI_Q=s48-c-k-c0xffffffff-no-nd-rj";
        const authorURL = "https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw";
        embed
            .setColor( "#9d0000" )
            .setAuthor( "Official Rick Astley", authorImage, authorURL )
            .setURL( "https://www.youtube.com/watch?v=dQw4w9WgXcQ" )
            .setImage( "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" )
            .setTitle( "Rick Astley - Never Gonna Give You Up (Video)" )
            .addFields( [ 
                {
                    name : "Video created",
                    value : "Oct. 25, 2009",
                    inline : true
                },
                { 
                    name : "Released",
                    value : "June 27, 1987",
                    inline : true
                },
                { 
                    name : "Writers",
                    value : "Pete Waterman, Mike Stock, Matt Aitken"
                }
            ] );
        channel.send( { embed } );
    },
    nc( { channel } ) { 
        const embed = new Discord.MessageEmbed( );
        embed
            .setColor( "#999999" )
            .setImage( "https://images.uncyclomedia.co/uncyclopedia/en/thumb/f/f8/Nojesus.jpg/400px-Nojesus.jpg" )
            .setTitle( "Nobody cares." )
            .setURL( "https://en.uncyclopedia.co/wiki/Nobody_cares" )
            .setDescription( "Nobody cares is a policy employed by dictators, despots, democracy, the general public, and the wiki administration. It would be considered the largest epidemic facing the world today if it weren't for the fact that nobody gives a flying cow about epidemics." );
        channel.send( { embed } );
    },
    whois( { } ) { },
    info( { channel } ) { 
        fs.readFile( `${ __dirname }/help.txt`, "utf-8", ( err, data ) => { 
            if ( err ) {
                console.log( err );
                return channel.send( "There is no command directory for this bot." );
            } else {
                console.log( data );
                channel.send( data );
            }
        } );
    },
    countdown( { channel, args } ) { 
        const arr = [ 
            "5...",
            "4...",
            "3...",
            "2...",
            "1...!",
            "Blast off!"
        ];
        let [ d ] = args;
        let delay = isNum( d ) ? parseInt( d ) : 500;
        if ( delay < 1 ) delay = 500;
        let done = false;
        let interval = setInterval( ( ) => { 
            if ( done ) { 
                clearInterval( interval );
                interval = null;
                return channel.send( "The countdown has been completed!" );
            }
            const item = arr.shift( );
            channel.send( item );
            if ( arr.length === 0 ) done = true;
        }, delay );
    },
    binary( { channel, args } ) { 
        const string = args.join( " " );
        const result = Array.from( string )
            .reduce( ( a, c ) => a.concat( c.charCodeAt( ).toString( 2 ) ), [ ] )
            .map( b => "0".repeat( 8 - b.length ) + b )
            .join( " " );
        channel.send( result );
    },
    random( { channel, args } ) { 
        let rand = 0, min, max;
        if ( args.length > 0 ) { 
            let [ x, y ] = args.map( ( e ) => parseInt( e, 10 ) );
            [ x, y ] = [
                isNum( x ) ? x : ( x < -MAX_SAFE_INTEGER ? -MAX_SAFE_INTEGER : x ),
                isNum( y ) ? y : ( y > MAX_SAFE_INTEGER ? MAX_SAFE_INTEGER : y )
            ];
            [ min, max ] = [ Math.min( x, y ), Math.max( x, y ) ];
        } else { 
            [ min, max ] =[ -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER ];
        }

        rand = Math.floor( Math.random( ) * ( max - min + 1 ) ) + min; 
        channel.send( rand );
    },
    fibonacci( { channel, args } ) { 
        let n = parseInt( args[ 0 ] );
        if ( !isNum( n ) ) { 
            return channel.send( "This is either not a number or Infinity." );
        }
        let [ a, b ] = [ 1, 0 ], t;
        while ( n >= 0 ) { 
            t = a;
            a = a + b;
            b = t;
            n--;
        }
        channel.send( String( b ) );
    },
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