const { evaluate } = require( "mathjs" );
module.exports = content => { 
    const scope = { };
    return evaluate( content, scope );
};