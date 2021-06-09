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
	async run( message, args ) { 
		const subs = [ ...DEFAULT_SUBS ];

		const [ a = "0" ] = args;

		const { channel, member, author } = message;
		const { id } = author;

		const hasEmbed = !( [ "0", "" ].includes( a ) );

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
				author: name,
				ups,
				nsfw
			} = data;

			const embed = new MessageEmbed( { 
				title,
				author: { name },
				image: { url },
				fields: [ { 
					name: "Subreddit",
					value: subreddit
				}, { 
					name: "Score",
					value: ups,
					inline: true
				} ],
				description: `This meme has been requested by ${member} on ${channel}.`,
				footer: { 
					text: `${subreddit} (${link})`
				}
			} );

			const randomKey = Math.floor( Math.random( ) * 1.5e12 );

			const content = hasEmbed ? { 
				files: [ { 
					attachment: url,
					name: `${subreddit}${randomKey}.jpg`
				} ]
			} : { embed };

			if ( nsfw ) { 
				const isNFSW = channel.name.trim( ) === "nsfw" || channel.name.trim( ) === "dank-memes";

				if ( !isNFSW ) { 
					message
						.edit( "The following meme is considered NSFW. Do you want to display it?" )
						.then( async ( ) => { 
							const limit = 30;

							try {
								const collected = await channel.awaitMessages( m => m.author.id === id, { 
									max: 1,
									time: limit * 1000
								} );

								const { content } = collected.first( );

								const yes = /^y(?:es|)|1$/i;

								if ( yes.test( content.trim( ) ) ) { 
									message.edit( content );
								} else { 
									message.edit( `${member} has not consented to have the meme shown.` );
								}
							} catch ( e ) {
								console.log( e );
								message.edit( `${member} has not responded in ${limit} seconds. The meme will not display.` );
							}
						} )
						.catch( ( ) => message.edit( "Error: Cannot show NSFW image." ) );
				} else { 
					message.edit( content );
				}
			} else { 
				message.edit( content );
			}
		} catch ( e ) { 
			console.log( e );
		} finally { 
			channel.stopTyping( );
		}
	}
}