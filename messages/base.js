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
            title : "JOINED"
        } );

        const wm = messages.welcome;
        const message = wm[ Math.floor( Math.random( ) * wm.length ) ];

        const result = message
            .replace( "$M", member )
            .replace( "$G", member.guild.name );

        const joined = member.joinedAt;
        const joinedDate = joined.toLocaleString( "en-US", { 
            weekday : "long",
            year : "numeric",
            day : "2-digit",
            month : "long"
        } );

        embed.fields.push( { 
            name : "User name",
            value : member.user.tag,
            inline : true
        }, { 
            name : "Joined at",
            value : joinedDate,
            inline : true
        } );

        embed.setThumbnail( member.user.displayAvatarURL( { 
            dynamic : true
        } ) );

        const uc = member.guild.channels.cache.find( c => c.name === "update" );
        const wc = member.guild.channels.cache.find( c => c.name === "welcome" );

        console.log( member, uc, wc );

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

        const currentDate = Date.now( );

        if ( kickLog ) { 
            const { executor, target, createdTimestamp } = kickLog;

            const executorMember = member.guild.member( executor );
            const targetMember = member.guild.member( target );

            const diff = currentDate - createdTimestamp;

            if ( member.user.id === target.id && diff < ( 1000 * 1.5 ) ) { 
                embed.setTitle( "KICKED" );

                embed.fields.push( { 
                    name : "Performer",
                    value : `${executorMember?.displayName ?? executor.username} (${executor.tag})`,
                    inline : true
                }, {
                    name : "Target",
                    value : `${targetMember?.displayName ?? target.username} (${target.tag})`,
                    inline : true
                } );

                if ( reason ) { 
                    embed.fields.push( { 
                        name : "Reason",
                        value : reason
                    } );
                }

                embed.setThumbnail( executor.displayAvatarURL( { 
                    dynamic : true
                } ) );
            } else {
                embed.setTitle( "LEFT" );

                embed.fields.push( { 
                    name : "User",
                    value : `${member?.displayName} (${member.user.tag})`,
                    inline : true
                } );
            }
        } else {
            embed.setTitle( "LEFT" );

            embed.fields.push( { 
                name : "User",
                value : `${member.displayName} (${member.user.tag})`,
                inline : true
            } );
        }

        const uc = member.guild.channels.cache.find( c => c.name === "update" );
        uc.send( { embed } );
    } );

    bot.on( "guildBanAdd", async ( guild, user ) => { 
        console.log( guild, user );

        const embed = new MessageEmbed( { 
            color : 0x964f4f,
            thumbnail : user.displayAvatarURL( { 
                dynamic : true
            } ),
            title : "BANNED"
        } );

        const fetchedLogs = await guild.fetchAuditLogs( { 
            limit : 1,
            type : "MEMBER_BAN_ADD"
        } );

        console.log( fetchedLogs );

        const banLog = fetchedLogs.entries.first( );

        if ( banLog ) { 
            const { executor, target, reason } = banLog;
            const executorMember = guild.member( executor );

            if ( target.id === user.id ) { 
                if ( reason ) { 
                    embed.fields.push( { 
                        name : "Reason",
                        value : reason,
                        inline : true
                    } );
                }
                
                if ( executor ) {
                    embed.fields.push( { 
                        name : "Performer",
                        value : `${executorMember?.displayName ?? executor.username} (${executor.tag})`,
                        inline : true
                    } );
                }
            }
        }

        embed.fields.push( { 
            name : "Target",
            value : `${guild.member( user )?.displayName ?? user.username} (${user.tag})`,
            inline : true
        } );

        const uc = guild.channels.cache.find( c => c.name === "update" );
        uc.send( { embed } );

        console.log( embed );
    } );
};