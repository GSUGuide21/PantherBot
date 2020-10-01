export default { 
    aliases : [ "remove" ],
    category : "Moderator",
    description : "Kicks a member from the server.",
    async run( { channel, msg, guild } ) { 
        const user = msg.mentions.users.first( );
        if ( !user ) return channel.send( "You need to specify a user to kick." );
        const member = guild.member( user );
        if ( !member ) return channel.send( "The user you are attempting to kick is not in this server." );
        return member.kick( )
            .then( ( ) => { } )
            .catch( ( e ) => { 
                console.log( e );
                channel.send( "You are unable to kick that person." );
            } );
    }
};