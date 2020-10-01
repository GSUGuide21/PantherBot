export default { 
    aliases : [ "destroy" ],
    category : "Moderator",
    description : "Bans a member from the server.",
    async run( { channel, msg, guild } ) { 
        const user = msg.mentions.users.first( );
        if ( !user ) return channel.send( "You need to specify a user to ban." );
        const member = guild.member( user );
        if ( !member ) return channel.send( "The user you are attempting to ban is not in this server." );
        return await member.ban( )
            .then( ( ) => { } )
            .catch( ( e ) => { 
                console.log( e );
                channel.send( "You are unable to ban that person." );
            } );
    }
};