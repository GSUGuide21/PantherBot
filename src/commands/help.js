import { MessageEmbed } from "discord.js";
import fs from "fs-extra";
import __dirname from "../dirname.js";

export default { 
    aliases : [ "command-help" ],
    category : "Main",
    description : "Shows a description to each of PantherBot's commands.",
    async run( { channel } ) {
        return fs.readFile( `${ __dirname }/help.txt`, "utf-8" ).then( ( data ) => { 
            console.log( data );
            channel.send( data );
        } ).catch( ( err ) => {
            console.log( err )
            return channel.send( "There is no command directory for this bot." );
        } );
    }
};