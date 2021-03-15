const { Command } = require( "discord.js-commando" );
const { MessageEmbed } = require( "discord.js" );
const axios = require( "axios" ).default;

module.exports = class SubredditCommand extends Command {
    constructor( bot ) { 
        super( bot, { 
            name : "subreddit",
            aliases : [ "gsureddit", "sr" ],
            memberName : "subreddit",
            group : "main",
            description : "Creates an embed with information about the latest post on r/GaState",
            argsType : "multiple"
        } );
    }

    async run( { channel }, args ) { 
        const rootURL = "https://www.reddit.com/r/GaState";

        const types = [ "new", "top", "rising", "hot" ];

        let [ type = "new" ] = args;

        if ( type === "" || !types.includes( type ) ) type = "new";

        const apiURL = `${rootURL}/${type}.json?limit=1`;

        const { data } = await axios
            .get( apiURL, { responseType : "json" } )
            .then( ( { data : response } ) => response?.data?.children?.[ 0 ] )
            .catch( error => ( { error } ) );

        if ( data.error || !data ) { 
            console.log( data.error );
            return channel.send( "Error loading subreddit data." );
        }

        const { 
            title,
            selftext,
            url,
            num_comments,
            author,
            score,
            created
        } = data;

        const description = `${selftext.slice( 0, 200 )}...`;

        const date = new Date( created * 1000 );

        const pad = n => { 
            if ( n < 10 && n > -10 ) { 
                return `${( n < 0 ) ? "-" : ""}0${Math.abs( n )}`;
            }

            return String( n );
        };

        const parsedDate = [ 
                [ date.getMonth( ) + 1, date.getDate( ), date.getFullYear( ) ],
                [ date.getHours( ), date.getMinutes( ), date.getSeconds( ) ]
            ]
            .map( ( m, i ) => { 
                return m.map( pad ).join( i === 0 ? "/" : ":" );
            } )
            .join( " " );

        const fields = Object.freeze( [ 
            { 
                name : "Comments",
                value : Number( num_comments ).toLocaleString( "en-US" ),
                inline : true
            },
            { 
                name : "Score",
                value : Number( score ).toLocaleString( "en-US" ),
                inline : true
            },
            { 
                name : "Created",
                value : parsedDate,
                inline : true
            },
            { 
                name : "Author",
                value : `${author} (https://www.reddit.com/u/${author})`
            },
        ] );

        const embed = new MessageEmbed( { 
            author : { 
                name : "r/GaState",
                iconURL : "https://styles.redditmedia.com/t5_2s6ds/styles/communityIcon_3nhlxejbgjy01.png?width=256&s=cb2f91f1599dc3d32b164a3563f2bbac0961bde6",
                url : rootURL
            },
            url,
            title,
            description,
            fields
        } );

        channel.send( { embed } );
    }
}