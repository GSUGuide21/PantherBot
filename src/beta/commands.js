import actions from "./actions.js";

export default class Command { 
    // Creates a constructor for the Command class
    constructor( name ) { 
        if ( new.target !== Command ) { 
            return new Command( name );
        }
        this.name = name;
        this.dispatched = false;
    }

    // Checks if the command exists
    async exists( ) { 
        const { name } = this;
        return actions.hasOwnProperty( name );
    }

    // Parses the command
    async parse( ) { 
        const exists = await this.exists( );
        const { name } = this;
        const result = { };
        if ( exists ) { 
            result.status = "error";
            result.errorText = `This command does not exists: ${ name }. Please use !help to check for available commands`;
        } else { 
            result.status = "success";
        }
        return result;
    }

    // Sends the command result to the channel
    send( { channel, msg, args, guild } ) { 
        const parse = this.parse( );
        return parse.then( ( result ) => { 
            const { status, errorText } = result;
            if ( status === "error" ) { 
                channel.send( errorText );
            } else { 
                this.action = actions[ name ];
                this.action( { channel, msg, args, guild } );
                this.dispatched = true;
            }
        } );
    }

    static parse( name ) { 
        return new Command( name );
    }
}