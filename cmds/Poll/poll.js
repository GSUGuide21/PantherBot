const { Command } = require( "discord.js-commando" );
const { MessageEmbed } = require( "discord.js" );

module.exports = class PollCommand extends Command { 
	constructor( bot ) { 
		super( bot, { 
			name : "poll",
			aliases : [ "p" ],
			group : "poll",
			memberName : "poll",
			description : "Creates a poll with up to 15 options.",
			args : [ 
				{ 
					key : "question",
					prompt : "What is the poll question?",
					type : "string",
					validate : question => { 
						if ( question.length > 9 ) return true;
						return "Poll questions must be at least 10 characters.";
					}
				},
				{
					key : "options",
					prompt : "What options do you want for the poll?",
					type : "string",
					validate : options => { 
						const optionsList = options.split( ";" );
						if ( optionsList.length > 1 ) return true;
						return "It must be at least 2 poll options.";
					}
				},
				{ 
					key : "time",
					prompt : "How long should the poll last?",
					default : "2 days",
					type : "string"
				}
			]
		} );
	}

	async run( message, args ) { 
		return message.channel.send( "Coming soon." );
	}
}