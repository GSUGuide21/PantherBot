const { Client } = require( "discord.js-commando" );
const { MessageEmbed } = require( "discord.js" );
const messages = require( "./messages.json" );

/**
 * Initializes bot messages
 * @param {Client} bot 
 */
module.exports = bot => { 
    console.log( bot.commandPrefix );
    bot.on( "guildMemberAdd", async member => { 
        const embed = new MessageEmbed( { 
            color : 0x3444cf,
            title : "Joined"
        } );

        const wm = messages.welcome;
        const message = wm[ Math.floor( Math.random( ) * wm.length ) ];

        const result = message
            .replace( "$M", member )
            .replace( "$G", member.guild.name );

        const joined = member.joinedAt;
        const joinedDate = joined.toLocaleDateString( "en-US", { 
            weekday : "long",
            year : "numeric",
            day : "2-digit",
            month : "long"
        } );

        embed.fields.push( { 
            name : "User name",
            value : member.user.tag
        }, { 
            name : "Joined at",
            value : joinedDate
        } );

        embed.setThumbnail( member.user.displayAvatarURL( { 
            dynamic : true
        } ) );

        const uc = member.guild.channels.cache.find( c => c.name === "update" );
        const wc = member.guild.channels.cache.find( c => c.name === "welcome" );

        uc.send( { embed } );
        wc.send( result );
    } );

    bot.on( "guildMemberRemove", async member => { 
        const embed = new MessageEmbed( { 
            color : 0x56afff,
            thumbnail : member.user.displayAvatarURL( { 
                dynamic : true
            } )
        } );

        const fetchedLogs = await member.guild.fetchAuditLogs( { 
            limit : 1,
            type : "MEMBER_KICK"
        } );

        const kickLog = fetchedLogs.entries.first( );

        if ( kickLog ) { 
            const { executor, target } = kickLog;

            if ( member.user.id === target.id ) { 
                embed.setTitle( "Kicked" );

                embed.fields.push( { 
                    name : "Performer",
                    value : executor.tag
                }, {
                    name : "Target",
                    value : target.tag
                } );
            } else {
                embed.setTitle( "Left" );

                embed.fields.push( { 
                    name : "User",
                    value : member.user.tag
                } );
            }
        } else {
            embed.setTitle( "Left" );

            embed.fields.push( { 
                name : "User",
                value : member.user.tag
            } );
        }

        const uc = member.guild.channels.cache.find( c => c.name === "update" );
        uc.send( { embed } );
    } );
};