const ROLES = Object.freeze( { 
    "Owner" : "756725597560111194",
    "Co-Owner" : "756726168165548092",
    "Admin" : "756729140954005566",
    "Head Moderator" : "756730661494194297",
    "Moderator" : "756731570521636985",
    "Bot" : "757581974872391697",
    "Alumni" : "756732738630844466",
    "SGA" : "756733250688516226",
    "Guide" : "756733522911297665",
    "NSFW" : "756736948936114208",
    "PantherBot" : "757076554168664155"
} );

const ADMIN_ROLES = Object.freeze( [ 
    "Owner",
    "Co-Owner",
    "Admin"
] );

const ADMIN_ROLE_IDS = Object.freeze( ADMIN_ROLES.map( ( role ) => { 
    return ROLES[ role ];
} ) );

const RESTRICTED_ROLES = Object.freeze( [ 
    "Owner",
    "Co-Owner",
    "Admin",
    "Head Moderator",
    "Moderator",
    "Bot",
    "PantherBot"
] );

export default { ADMIN_ROLES, ROLES, ADMIN_ROLE_IDS, RESTRICTED_ROLES };