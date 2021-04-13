const { Client } = require( "discord.js-commando" );
const { Message, GuildMember, Guild } = require( "discord.js" );
const { Schema, Model } = require("mongoose");
/** @type {Model} */
const warningSchema = require( "@models/warningSchema" );
const filters = require( "./filter.json" );

/**
 * Initializes bot message filters
 * @param {Client} bot 
 */
module.exports = bot => { 
    console.log( "Bot filters initialized!" );

    /**
     * @typedef {Object} ResponseOptions
     * @property {string} type
     * @property {string} content
     * @property {string} reason
     * @property {MessageEmbed} embed
     * @property {Message} message
     */

    /**
     * @typedef {Object} WarnOptions
     * @property {Guild} guild
     * @property {GuildMember} member
     * @property {ResponseOptions} response 
     * @property {string} reason
     * @property {number} limit
     * @property {Message} message
     */

    /**
     * @typedef {Object} FilterTriggerOptions
     * @property {Message} message,
     * @property {GuildMember} member,
     * @property {string} content,
     * @property {ResponseOptions} response
     * @property {Guild} guild
     */

    /**
     * Warns users when the filter is triggered
     * @param {WarnOptions} options 
     */
    async function warnUser( { 
        guild,
        member,
        response,
        reason,
        limit = 3,
        message
    } ) { 
        const query = { memberId : member.id };

        const exists = await warningSchema.exists( query );

        const { content = "", afterWarn = "kick" } = response;

        if ( !exists ) { 
            const schema = await new warningSchema( { 
                guildId : guild.id,
                memberId : member.id,
                warnings : 1
            } );

            schema.save( );

            message.reply( `Warning #1${ content ? `: ${content}` : "" }` );

            return;
        }

        const result = await warningSchema.findOne( query );

        if ( !result ) return;
        
        const { warnings, guildId, memberId } = result;

        if ( guildId !== guild.id ) return;

        if ( memberId !== member.id ) return;

        if ( parseInt( warnings ) > ( limit - 1 ) ) { 
            if ( afterWarn === "kick" && member.kickable ) { 
                member.kick( reason );
            } else if ( member.bannable ) { 
                member.ban( { reason } );
            }

            await warningSchema.deleteOne( query );

            return;
        }

        const w = warnings + 1;

        message.reply( `Warning #${ w }${ content ? `: ${content}` : "" }` );

        warningSchema.findOneAndUpdate( query, { warnings : w } );
    }

    /**
     * Responds when a filter has been triggered
     * @param {FilterTriggerOptions} options 
     */
    async function respondToFilter( { 
        message,
        guild,
        content = "",
        member,
        response = { }
    } ) { 
        const { type, content : text, limit, reason = "" } = response;

        const parsedReason = reason
            .replace( /\$M/g, member.user.tag )
            .replace( /\$G/g, guild.name )
            .replace( /\$C/g, content );

        switch ( type ) { 
            case "kick" : { 
                member
                    .kick( parsedReason )
                    .then( ( ) => { 
                        if ( message.deletable ) message.delete( );
                    } );

                break;
            } 
            case "ban" : { 
                member
                    .ban( { parsedReason } )
                    .then( ( ) => { 
                        if ( message.deletable ) message.delete( );
                    } );
                break;
            }
            case "reply" : { 
                message
                    .reply( text )
                    .then( ( ) => { 
                        if ( message.deletable ) message.delete( );
                    } );
                break;
            }
            case "warn" : { 
                warnUser( { 
                    guild, 
                    member, 
                    response, 
                    limit,
                    reason : parsedReason,
                    message
                } );
                break;
            }
        }
    }

    /**
     * Helper function to search for messages to filter
     * @param {Message} message 
     */
    async function createFilters( message ) { 
        const { 
            content,
            guild,
            member
        } = message;

        if ( message.author.bot ) return;

        for ( const filter of filters ) { 
            const { 
                response,
                value,
                type
            } = filter;

            const regex = [ "regex", "regexp", "pattern" ];

            if ( regex.includes( type ) ) { 
                const flags = [ ], { patternFlags = { } } = filter;
                const { globalMatch = false, insensitive = false, multiline = false } = patternFlags;

                if ( globalMatch ) flags.push( "g" );
                if ( insensitive ) flags.push( "i" );
                if ( multiline ) flags.push( "m" );

                const pattern = new RegExp( value, flags.join( "" ) );

                if ( pattern.test( value ) ) { 
                    return respondToFilter( { 
                        message,
                        guild,
                        content,
                        member,
                        response,
                        message
                    } );
                }

                continue;
            }

            if ( 
                typeof value === "string" &&
                value === content.trim( )
            ) {
                return respondToFilter( { 
                    message,
                    guild,
                    content,
                    member,
                    response,
                    message
                } );
            }
        }
    }

    bot.on( "message", createFilters );
};