import Discord from "discord.js";

export default { 
    /**
     * @property {string} name
     */
    name : "kick",
    /**
     * @param {Object} obj
     * @param {Discord.Guild} obj.guild
     * @param {Discord.Message} obj.msg
     * @param {Discord.User} obj.author
     * @param {Array<string>} obj.args
     */
    async run( { guild, msg, author, args } ) { 
        
        const target = guild.member( 
            msg.mentions.users.first( ) ||
            guild.members.cache.get( args[ 0 ] )
        );

        const reason = args.slice( 1 ).join( " " );

        const update = guild.channels.cache.find( x => x.name === "update" );

        const lobby = guild.channels.cache.find( x => x.name === "lobby" );

        if ( !msg.member.hasPermission( "KICK_MEMBERS" ) ) {
            
            return await msg.reply( "you do not have permissions to use this command!" );
        
        }

        if ( !target ) { 

            return await msg.reply( "Please specify a member to kick!" );

        }

        if ( !reason ) { 

            return await msg.reply( "Please specify a reason to kick this member!" );
            
        }

        const embed = new Discord.MessageEmbed( { 
            color : 0x003485
        } );

        embed
            .setThumbnail( target.user.avatarURL( ) )
            .setTitle( "Kicked" )
            .addFields( [ 
                { 
                    name : "Member",
                    value : target.user.username
                }, {
                    name : "Performer",
                    value : author.username
                },
                {
                    name : 'Reason',
                    value : reason
                }
            ] );
        
        lobby.send( `${target.user.username} has been kicked by ${author} for ${reason}.`);

        target.kick( reason );

        return await update.send( { embed } );
    } 
};