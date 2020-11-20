import Discord from "discord.js";

export default { 
	commands : [ "rickroll", "rr" ],
	/**
	 * @param {Discord.Message} msg
	 * @param {string[]} args
	 * @param {string} text
	 **/
	async run( msg, args, text ) { 
		const embed = new Discord.MessageEmbed( { 
			author : {
				name : "Official Rick Astley",
				iconURL : "https://yt3.ggpht.com/a/AATXAJy4EOYqoWGNS5eqtj0mc0C16I7U-s5cyZkkK5RI_Q=s48-c-k-c0xffffffff-no-nd-rj",
				url : "https://www.youtube.com/channel/UCuAXFkgsw1L7xaCfnd5JJOw"
			},
			url : "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			title : "Rick Astley - Never Gonna Give You Up (Video)",
			image : {
				url : "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
			},
			color : 0x9d0000,
			fields : [ 
				{
					name : "Video created",
					value : "October 25, 2009",
					inline : true
				},
				{
					name : "Released",
					value : "June 27, 1987",
					inline : true
				},
				{
					name : "Writers",
					value : "Pete Waterman, Mike Stock, Matt Aitken"
				}
			]
		} );

		msg.channel.send( { embed } );
	}
};