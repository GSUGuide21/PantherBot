export default { 
    aliases : [ "fuckyou" ],
    category : "Random",
    description : "Allows PantherBot to reply \"fuck you.\"",
    async run( { msg } ) { 
        return msg.reply( "fuck you!" );
    }
};