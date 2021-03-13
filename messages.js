const { MessageEmbed, GuildMember, Client } = require( "discord.js" );
const welcomeMessages = require( "./welcome/messages.json" );

function pad( x ) { 
    let n = Number( x ), r = "";
    if ( n < 10 && n > -10 ) { 
        r = n < 0 ? `-0${Math.abs( n )}` : `0${n}`;
    } else { 
        r = String( n );
    }
    return r;
}

function parseDate( d ) { 
    d = d instanceof Date ? d : new Date( d );

    const M = d.getMonth( ) + 1;
    const D = d.getDate( );
    const Y = d.getFullYear( );

    const h = d.getHours( );
    const m = d.getMinutes( );
    const s = d.getSeconds( );

    return `${pad(M)}/${pad(D)}/${Y} ${pad(h)}:${pad(m)}:${pad(s)}`;
}

module.exports = { 
    /**
     * Sends a welcome message to the server
     * @param {GuildMember} member 
     * @param {Client} bot 
     */
    welcome : ( member, bot ) => { 
        const { guild, user } = member;

        const welcomeChannel = guild.channels.cache.find( x => x.name === "welcome" );
        const updateChannel = guild.channels.cache.find( x => x.name === "update" );

        const avatar = user.displayAvatarURL( { 
            format : "png",
            dynamic : true
        } );

        const embed = new MessageEmbed( { 
            color : 0x346fdf,
            title : "JOINED",
            image : avatar
        } );

        embed.addFields( [ 
            { 
                name : "Discord User Name",
                value : user.tag
            },
            {
                name : "Join Time",
                value : parseDate( member.joinedAt )
            }
        ] );

        const len = welcomeMessages.length;

        const randomIndex = Math.floor( Math.random( ) * len );

        const welcomeMessage = welcomeMessages[ randomIndex ];

        const result = welcomeMessage.replace( "$M", member );

        updateChannel.send( { embed } );

        welcomeChannel.send( result );
    }
};