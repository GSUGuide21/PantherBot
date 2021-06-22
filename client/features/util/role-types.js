const OWNERS = Object.freeze( [ 
	"Owner",
	"Co-Owner",
	"Senior Admin"
] );

const ADMINISTRATORS = Object.freeze( [ 
	...OWNERS,
	"Admin",
	"Head Moderator"
] );

const MODERATORS = Object.freeze( [
	...ADMINISTRATORS,
	"Moderator",
	"Ambassador"
] );

const BOTS = Object.freeze( [ 
	"Bot"
] );

const GROUPS = Object.freeze( [ 
	"SGA",
	"Guide",
	"Controversial",
	"NSFW",
	"Alumni"
] );

const CLASSES = Object.freeze( [ 
	"Class of 2019",
	"Class of 2020",
	"Class of 2021",
	"Class of 2022",
	"Class of 2023",
	"Class of 2024",
	"Class of 2025"
] );

const COLLEGES = Object.freeze( [ 
	"AYSPS",
	"RCB",
	"Public Health",
	"College of Law",
	"College of Nursing",
	"College of Education",
	"A&S",
	"Biomedical Sciences",
	"College of the Arts",
	"Perimeter College"
] );

module.exports = Object.freeze( { 
	OWNERS,
	ADMINISTRATORS,
	MODERATORS,
	BOTS,
	GROUPS,
	CLASSES,
	COLLEGES
} );