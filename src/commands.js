export default class Commands { 
    static test( msg ) { 
        console.log( msg );
        return "Test complete!";
    }
    static fy( { author } ) {
        return `Fuck you, @${ author }!`;
    }
    static nc( ) {
        return "**[Nobody cares.](https://en.uncyclopedia.co/wiki/Nobody_cares)**";
    }
}