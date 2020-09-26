export default ( date = new Date( ), format = "mm/dd/yy 12hh:ii:ss p" ) => { 
    if ( !( date instanceof Date ) ) {
        date = new Date( date );
    }
    const pad = ( n ) => n < 10 ? "0" + n : String( n );
    const year = date.getFullYear( );
    const month = date.getMonth( );
    const day = date.getDate( );
    const dotw = date.getDay( );
    const hours = date.getHours( );
    const minutes = date.getMinutes( );
    const seconds = date.getSeconds( );

    const monthNames = [ 
        "January", "February", "March", "April", 
        "May", "June", "July", "August", 
        "September", "October", "November", "December" 
    ];

    const dayNames = [ 
        "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ];

    const o = Object.freeze( { 
        yyyy : year,
        yy : pad( year % 100 ),
        y : year % 100,
        mmmm : monthNames[ month ],
        mmm : monthNames[ month ].slice( 0, 3 ),
        mm : pad( month + 1 ),
        m : month + 1,
        dddd : dayNames[ dotw ],
        ddd : dayNames[ dotw ].slice( 0, 3 ),
        dd : pad( day ),
        d : day,
        "12hh" : pad( hours % 12 === 0 ? 12 : hours % 12 ),
        "12h" : hours % 12 === 0 ? 12 : hours % 12,
        hh : pad( hours ),
        h : hours,
        ii : pad( minutes ),
        i : minutes,
        ss : pad( seconds ),
        s : seconds,
        p : hours < 12 ? "PM" : "AM"
    } );

    const result = Object.keys( o ).reduce( ( acc, key ) => { 
        const value = o[ key ];
        const pattern = new RegExp( key, "g" );
        return acc.replace( pattern, value );
    }, format );

    return result;
};