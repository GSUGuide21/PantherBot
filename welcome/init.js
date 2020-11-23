import Discord, { MessageAttachment } from "discord.js";
import fs from "fs-extra";
import Canvas from "canvas";
import __dirname from "../dirname.js";

/**
 * @param {Discord.Client} bot
 */
export default bot => { 
	bot.on( "guildMemberAdd", async m => { 
		const { id } = m.user;

		const tagUser = `<@${id}>`;

		const welcomeData = await fs
			.readFile( `${__dirname}/txt/welcome.txt`, "utf-8" );

		const welcomeMessages = welcomeData
			.split( /\n/g )
			.map( x => x.trim( ) );
		
		const { length : welcomeLength } = welcomeMessages;

		const welcomeIndex = Math.floor( Math.random( ) * welcomeLength );

		const welcomeMessage = welcomeMessages[ welcomeIndex ];

		const welcomeResult = welcomeMessage.replace( /\$t~/g, tagUser );

		const welcomeChannel = m.guild.channels.cache.find( x => x.name === "welcome" );

		/**
		 * @type {HTMLCanvasElement}
		 */
		// const c = Canvas.createCanvas( 600, 350 );

		/**
		 * @type {CanvasRenderingContext2D}
		 */
		/*const ctx = c.getContext( "2d" );

		const [ 
			background,
			bx, 
			by 
		] = [ 
			await Canvas.loadImage( `${__dirname}/background.png` ),
			0, 
			0 
		];

		ctx.drawImage( background, bx, by );

		const avatar = await Canvas.loadImage( 
				m.user.displayAvatarURL( { 
					format : "png"
				} )
			);
		
		const [
			ax,
			ay
		] = [
			30,
			( c.width / 2 ) - ( avatar.width / 2 ) 
		]

		ctx.drawImage( avatar, ax, ay );

		const attachment = new MessageAttachment( c.toBuffer( ) );
		*/
		welcomeChannel.send( [ 
			welcomeResult/*,
			attachment*/
		] );
	} );
};