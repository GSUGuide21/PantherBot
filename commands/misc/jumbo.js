import Discord from "discord.js";
// import Jumbo from "../../jumbo/init.js";

export default { 
	commands : [ "jumbo", "j" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) {
		msg.channel.send( "TODO!" );
		/*const word = await Jumbo.start( msg );

		const { id : userid } = msg.author;

		Jumbo.join( msg, { userid, host : true } );

		if ( args[ 0 ] ) {
			const r = Number( args[ 0 ] );

			if ( 
				!isNaN( r ) &&
				isFinite( r ) && 
				r > 0
			) Jumbo.setRoundLimit( r );
		}

		const filter = ( m ) => {

		};

		const options = { };

		const collector = msg.channel.createMessageCollector( filter, options );

		collector.on( "collect", m => { 

		} );*/
	}
}