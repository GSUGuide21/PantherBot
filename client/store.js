const { CommandStore } = require( "@sapphire/framework" );
// const { PantherBotCommand } = require( "./command" );

module.exports = class PantherBotCommandStore extends CommandStore { 
	fetchCategory = category => { 
		if ( !this.categories.includes( category ) ) return undefined;
		const filter = this.filter( command => command.category === category );
		filter.name = category;
		return filter;
	};

	categorized = ( ) => this.categories.map( this.fetchCategory );

	get categories( ) { 
		return Array.from( new Set( this.map( command => command.category ) ) );
	}
}