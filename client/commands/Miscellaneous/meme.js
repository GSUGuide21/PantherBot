const { Command } = require( "discord.js-commando" );
const { MessageEmbed, TextChannel, Message, MessageAttachment } = require( "discord.js" );
const axios = require( "axios" ).default;

const DEFAULT_SUBS = Object.freeze( [ 
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
	"PrequelMemes",
	"fakehistoryporn",
	"starterpacks"
] );

const DANK_MEMES = Object.freeze( [ 
	"deepfriedmemes",
	"surrealmemes",
	"nukedmemes",
	"BlackPeopleTwitter"
] );

const ANIME_MEMES = Object.freeze( [ 
	"animememes",
	"AnimeFunny"
] );

const GAMING_MEMES = Object.freeze( [ 
	"gamingmemes",
	"PS4memes",
	"PS5memes",
	"gaming"
] );

module.exports = class MemeCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "meme",
			memberName : "meme",
			aliases : [ "m" ],
			group : "miscellaneous",
			description : "Sends a random meme to the chat.",
			argsType: "multiple"
		} );
	}

	/**
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	async run( { channel }, args ) { 
		const subs = [ ...DEFAULT_SUBS ];

		const hasEmbed = args.length > 0;

		switch ( channel.name ) { 
			case "gaming" :
				subs.push( ...GAMING_MEMES );
				break;
			case "dank-memes" :
				subs.push( ...DANK_MEMES );
				break;
			case "anime" :
				subs.push( ...ANIME_MEMES );
				break;
		}

		const randomIndex = Math.floor( Math.random( ) * subs.length );

		const sub = subs[ randomIndex ];

		channel.startTyping( );

		try { 
			const { data } = await axios.get( `https://meme-api.herokuapp.com/gimme/${sub}` );

			const { 
				title,
				url,
				subreddit,
				postLink: link,
				author: name
			} = data;

			const embed = new MessageEmbed( { 
				title,
				author: { name },
				image: { url },
				footer: `${subreddit} (${link})`
			} );

			const randomKey = Math.floor( Math.random( ) * 1.5e12 );

			channel.send( hasEmbed ? { 
				files: [ { 
					attachment: url,
					name: `${subreddit}${randomKey}.jpg`
				} ]
			} : { embed } );
		} catch ( e ) { 
			console.log( e );
		} finally { 
			channel.stopTyping( );
		}
	}
}