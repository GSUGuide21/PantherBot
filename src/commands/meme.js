import randomPuppy from "random-puppy";
import __dirname from "./dirname.js";

export default { 
    aliases : [ "sendmeme" ],
    category : "Random",
    description : "Sends a random meme to the channel.",
    async run( { channel } ) { 
        const subreddits = [ 
            "meme",
            "MemeEconomy",
            "meirl",
            "me_irl",
            "2meirl4meirl",
            "wholesomememes",
            "AdviceAnimals",
            "ComedyCemetery",
            "raimimemes",
            "wackytictacs",
            "PrequelMemes"
        ];

        const dankmemes = [ 
            "deepfriedmemes",
            "surrealmemes",
            "nukedmemes"
        ];

        const animememes = [ 
            "animememes",
            "AnimeFunny",
            "MemesOfAnime"
        ];

        const gamingmemes = [ 
            "gamingmemes"
        ];

        if ( channel.name === "dank-memes" ) { 
            subreddits.push( ...dankmemes );
        } else if ( channel.name === "anime" ) { 
            subreddits.push( ...animememes );
        } else if ( channel.name === "gaming" ) { 
            subreddits.push( ...gamingmemes );
        }
        const { length } = subreddits;
        const r = Math.floor( Math.random( ) * ( length - 1 ) );
        const subreddit = subreddits[ r ];

        channel.startTyping( );
        return await randomPuppy( subreddit ).then( async ( url ) => { 
            return await channel.send( { 
                files : [ { 
                    attachment : url,
                    name : `meme.${ subreddit }.png`
                } ]
            } );
        } )
        .then( ( ) => channel.stopTyping( ) )
        .catch( ( e ) => console.error( e ) );
    }
};