const parse = ( { match, user, key } ) => { 
    const finalKey = key.toLowerCase( );
    if ( user.hasOwnProperty( finalKey ) ) {
        const t = [ "boolean", "string", "number" ];
        if ( t.includes( typeof value ) ) {
            return value;
        } else if ( value.toString ) {
            return value.toString( );
        }
        return match;
    }
    return match;
};

const afterMessage = "Please read the rules on the $rules channel. Ignorance to the rules will not be excused.";

export default { 
    join : { 
        messages : [ 
            "Welcome to the fray, **<@$id>**!",
            "Welcome aboard, **<@$id>**!",
            "Thank you for coming, **<@$id>**!"
        ],
        after : afterMessage,
        send( { channel, id, guild } ) { 
            const messages = this.messages;
            const length = messages.length;
            const randomIndex = Math.floor( Math.random( ) * length );
            const message = messages[ randomIndex ];
            const messageResult = message.replace( /\$id/g, id );
            const rules = guild.channels.cache.find( c => c.name === "rules" );
            const result = [ messageResult, this.after.replace( /\$rules/g, rules ) ].join( " " );
            channel.send( result );
        }
    },
    leave : { 
        messages : [ 
            "Goodbye, **$username!**",
            "**$username**, thank you, come again!",
            "**$username** has went to the Other World"
        ],
        send( { channel, user } ) { 
            const messages = this.messages;
            const length = messages.length;
            const randomIndex = Math.floor( Math.random( ) * length );
            const message = messages[ randomIndex ];
            const result = message.replace( /\$([a-z\_\-]+)/gi, ( match, key ) => { 
                return parse( { match, user, key } );
            } );
            channel.send( result );
        }
    },
    kick : { 
        messages : [ 
            "**$username** has been put on a timeout!",
            "**$username** has been kicked from this server.",
            "**$username** has been benched from the game!"
        ],
        send( { channel, user } ) { 
            const messages = this.messages;
            const length = messages.length;
            const randomIndex = Math.floor( Math.random( ) * length );
            const message = messages[ randomIndex ];
            const result = message.replace( /\$([a-z\_\-]+)/gi, ( match, key ) => { 
                return parse( { match, user, key } );
            } );
            channel.send( result );
        }
    },
    ban : { 
        messages : [ 
            "**$username** has been banned from this server.",
            "**$username** has been sent to the Shadow Realm!",
            "**$username** has been sent to the Other World!",
            "**$username**, you're out of here!",
            "**$username**, take off your jacket and leave Hell's Kitchen."
        ],
        send( { channel, user } ) { 
            const messages = this.messages;
            const length = messages.length;
            const randomIndex = Math.floor( Math.random( ) * length );
            const message = messages[ randomIndex ];
            const result = message.replace( /\$([a-z\_\-]+)/gi, ( match, key ) => { 
                return parse( { match, user, key } );
            } );
            channel.send( result );
        }
    }
};