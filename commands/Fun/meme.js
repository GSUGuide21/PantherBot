import Discord from "discord.js";

import randomPuppy from "random-puppy";

export default { 
    /**
     * @property {string} name
     */
    name : "meme",
    /**
     * @property {Array<string>} aliases
     */
    aliases : [ "m", "randommeme" ],
    /**
     * @property {string} description
     */
    description : "",
    /**
     * @property {string} syntax
     */
    syntax : "$meme",
    /**
     * @param {Object} obj
     * @param {Array<string>} obj.args
     * @param {Discord.TextChannel|Discord.DMChannel|Discord.NewsChannel} obj.channel
     */
    async run( { args, channel } ) { 
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

        switch ( channel.name ) {
            case "gaming" : subreddits.push( ...gamingmemes ); break;
            case "dank-memes" : subreddits.push( ...dankmemes ); break;
            case "anime" : subreddits.push( ...animemes ); break;
        }

        const r = Math.floor( Math.random( ) * ( subreddits.length - 1 ) );

        const subreddit = subreddits[ r ];

        channel.startTyping( );

        return await randomPuppy( subreddit ).then( async url => { 
            return await channel.send( { 
                files : [ { 
                    attachment : url,
                    name : `meme.${subreddit}.png`
                } ]
            } );
        } )
        .then( ( ) => channel.stopTyping( ) )
        .catch( e => console.log( e ) );
    }
}