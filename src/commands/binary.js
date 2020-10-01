export default { 
    acceptedArgs : [ "value" ],
    category : "Random",
    description : "Converts your message to binary code.",
    handleArgs( args ) { 
        return args.join( " " );
    },
    async run( { channel, args } ) { 
        const { value } = args;
        const r = Array.from( value )
            .reduce( ( a, c ) => a.concat( c.charCodeAt( ).toString( 2 ) ), [ ] )
            .map( ( b ) => "0".repeat( 8 - b.length ) + b )
            .join( " " );
        return await channel.send( String( r ) );
    }
};