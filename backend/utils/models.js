import { Sequelize, DataTypes } from "sequelize";
import fs from "fs";

// Read database configuration from file
const rawConfig = fs.readFileSync("./db_config.json");
const dbConfig = JSON.parse(rawConfig);
console.log(dbConfig);

// Create Sequelize instance
const db = new Sequelize({
    dialect: "mysql",
    host: dbConfig.host,
    username: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
});

// Test connection
try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}

// Define Users model
const Users = db.define(
    "Users",
    {
        email: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        verification_token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "USERS",
        timestamps: false,
    }
);

// Define Tournaments model
const Tournaments = db.define(
    "Tournaments",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        discipline: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        geo_coordinates: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        max_participants: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        app_deadline: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "TOURNAMENTS",
        timestamps: false,
    }
);

// Define TournamentParticipants model
const TournamentParticipants = db.define(
    "TournamentParticipants",
    {
        tournament_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        participant: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "TOURNAMENT_PARTICIPANTS",
        timestamps: false,
        primaryKey: {
            fields: ["tournament_id", "participant"],
        },
    }
);

// Define Sponsors model
const Sponsors = db.define(
    "Sponsors",
    {
        name: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
        },
        website: {
            type: DataTypes.STRING,
        },
    },
    {
        tableName: "SPONSORS",
        timestamps: false,
    }
);

// Define TournamentSponsors model
const TournamentSponsors = db.define(
    "TournamentSponsors",
    {
        tournament_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sponsor_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: "TOURNAMENT_SPONSORS",
        timestamps: false,
        primaryKey: {
            fields: ["tournament_id", "sponsor_name"],
        },
    }
);

// Define TournamentResults model
const TournamentResults = db.define(
    "TournamentResults",
    {
        tournament_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        participant1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        participant2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        score1: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        score2: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: "TOURNAMENT_RESULTS",
        timestamps: false,
        primaryKey: {
            fields: ["tournament_id", "participant1", "participant2"],
        },
    }
);

// Define LADDER
const Ladder = db.define(
    "Ladder",
    {
        tournament_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        participant: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        idx: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "LADDER",
        timestamps: false,
        primaryKey: {
            fields: ["tournament_id", "participant"],
        },
    }
);

// Define relationships between models
Tournaments.belongsTo(Users, { foreignKey: "creator" });
TournamentParticipants.belongsTo(Tournaments, { foreignKey: "tournament_id" });
TournamentParticipants.belongsTo(Users, { foreignKey: "participant" });
TournamentSponsors.belongsTo(Tournaments, { foreignKey: "tournament_id" });
TournamentSponsors.belongsTo(Sponsors, { foreignKey: "sponsor_name" });
TournamentResults.belongsTo(Tournaments, { foreignKey: "tournament_id" });
TournamentResults.belongsTo(Users, { foreignKey: "participant1" });
TournamentResults.belongsTo(Users, { foreignKey: "participant2" });
Ladder.belongsTo(Tournaments, { foreignKey: "tournament_id" });
Ladder.belongsTo(Users, { foreignKey: "participant" });


// Export models
export { Users, Tournaments, TournamentParticipants, Sponsors, TournamentSponsors, TournamentResults, Ladder };
