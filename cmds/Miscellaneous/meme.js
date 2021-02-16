const { Command } = require( "discord.js-commando" );
const randomPuppy = require( "random-puppy" );

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
			description : "Sends a random meme to the chat."
		} );
	}

	async run( { channel } ) { 
		const subs = [ ];

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
			default :
				subs.push( ...DEFAULT_SUBS );
		}

		const randomIndex = Math.floor( Math.random( ) * subs.length );

		const sub = subs[ randomIndex ];

		channel.startTyping( );

		return await randomPuppy( sub )
			.then( async url => await channel.send( { 
				files : [ { attachment : url, name : `meme.${sub}.png` } ]
			} ) )
			.catch( e => console.log( e ) )
			.finally( ( ) => channel.stopTyping( ) );
	}
}