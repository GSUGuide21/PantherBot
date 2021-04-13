const Game = require( "./base" );

module.exports = class HangmanGame extends Game { 
    constructor( bot, options = { } ) { 
        super( bot, { 
            useEmbed : true,
            name : "hangman",
            title : "Hangman"
        } );

        const { 
            delay = 1000
        } = options;

        const loopInterval = ( ) => { 
            if ( delay === "frame" ) { 
                this.interval = requestAnimationFrame( loopInterval )
            } else if ( 
                ( isNaN( delay ) || !isFinite( delay ) ) ||
                ( Math.abs( delay ) !== delay )
            ) { 
                this.interval = setTimeout( loopInterval, 1000 );
            } else { 
                this.interval = setTimeout( loopInterval, delay );
            }
        };
    }
};