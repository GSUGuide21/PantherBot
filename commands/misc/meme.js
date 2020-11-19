import Discord from "discord.js";
import randomPuppy from "random-puppy";

export default {
	commands : [ "meme", "m" ],
	async run( msg ) { 
		const subs = [ 
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
		];

		const dankMemes = [ 
			"deepfriedmemes",
			"surrealmemes",
			"nukedmemes",
			"BlackPeopleTwitter"
		];

		const animeMemes = [ 
			"animememes",
			"AnimeFunny"
		];

		const gamingMemes = [ 
			"gamingmemes",
			"PS4memes",
			"PS5memes"
		];

		switch ( msg.channel.name ) {
			case "gaming" : 
				subs.push( ...gamingMemes );
				break;
			case "dank-memes" :
				subs.push( ...dankMemes );
				break;
			case "anime" :
				subs.push( ...animeMemes );
				break;
		}

		const r = Math.floor( Math.random( ) * ( subs.length - 1 ) );

		const sub = subs[ r ];

		msg.channel.startTyping( );

		return await randomPuppy( sub )
			.then( async url => { 
				return await msg.channel.send( {
					files : [ { 
						attachment : url,
						name : `meme.${sub}.png`
					} ]
				} );
			} )
			.catch( e => console.log( e ) )
			.finally( ( ) => msg.channel.stopTyping( ) );
	}
}