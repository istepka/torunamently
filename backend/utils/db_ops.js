import { Users, Tournaments, TournamentParticipants, Sponsors, TournamentSponsors, TournamentResults } from "./models.js";
import { hashPassword } from "./crypt.js";
import jwt from 'jsonwebtoken';

const secret = "123";

// Function to create a new user
async function createUser(email, password, verified = false, verificationToken = null) {
    try {
        const user = await Users.create({
            email,
            password,
            verified,
            verification_token: verificationToken,
        });
        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

// Function to add a participant to a tournament
async function addParticipantToTournament(tournamentId, participantEmail) {
    try {
        const participant = await TournamentParticipants.create({
            tournament_id: tournamentId,
            participant: participantEmail,
        });
        return participant;
    } catch (error) {
        throw new Error(`Error adding participant to tournament: ${error.message}`);
    }
}

// Function to create a new sponsor
async function createSponsor(name, logo = null, website = null) {
    try {
        const sponsor = await Sponsors.create({
            name,
            logo,
            website,
        });
        return sponsor;
    } catch (error) {
        throw new Error(`Error creating sponsor: ${error.message}`);
    }
}

// Function to add a sponsor to a tournament
async function addSponsorToTournament(tournamentId, sponsorName) {
    try {
        const tournamentSponsor = await TournamentSponsors.create({
            tournament_id: tournamentId,
            sponsor_name: sponsorName,
        });
        return tournamentSponsor;
    } catch (error) {
        throw new Error(`Error adding sponsor to tournament: ${error.message}`);
    }
}

// Function to record tournament results
async function recordTournamentResults(data) {
    try {
        const results = await TournamentResults.create(data);
        return results;
    } catch (error) {
        throw new Error(`Error recording tournament results: ${error.message}`);
    }
}

async function getAllTournaments() {
    try {
        const tournaments = await Tournaments.findAll();
        return tournaments;
    } catch (error) {
        throw new Error(`Error fetching tournaments: ${error.message}`);
    }
}

async function signUp(email, password) {
    try {
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await Users.create({
            email,
            password: hashedPassword,
        });

        return user;
    } catch (error) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

async function signIn(email, password) {
    try {
        // Find user by email
        const user = await Users.findOne({
            where: { email: email },
        });

        if (user) {
            // Email exists
            const hashedPassword = await hashPassword(password);

            if (user.password === hashedPassword) {
                // Password matches
                if (user.verified) {
                    // Account is verified

                    // Note: You need to import and configure 'jsonwebtoken' library for JWT
                    const token = jwt.sign({ email }, secret, { expiresIn: '1h' });

                    return { status: "success", message: "Login successful!", token };
                } else {
                    // Account is not verified
                    return { status: "error", message: "Account is not verified!", token: "" };
                }
            } else {
                // Password does not match
                return { status: "error", message: "Password does not match!", token: "" };
            }
        } else {
            // Email does not exist
            return { status: "error", message: "Email does not exist!", token: "" };
        }
    } catch (error) {
        throw new Error(`Error during sign-in: ${error.message}`);
    }
}

async function verifyAccount(email, token) {
    try {
        // Find user by email
        const user = await Users.findOne({
            where: { email: email },
        });

        if (user) {
            // Email exists
            if (user.verification_token === token) {
                // Token matches

                // Update verified column to 1
                await user.update({ verified: true });

                return { status: "success", message: "Account verified successfully!" };
            } else {
                // Token does not match
                return { status: "error", message: "Token does not match!" };
            }
        } else {
            // Email does not exist
            return { status: "error", message: "Email does not exist!" };
        }
    } catch (error) {
        throw new Error(`Error during account verification: ${error.message}`);
    }
}

async function getListOfTournamentsUserIsSignedUpTo(email) {
    try {
        // Find tournament IDs where the user is signed up
        const tournamentIds = await TournamentParticipants.findAll({
            where: { participant: email },
            attributes: ['tournament_id'],
        });

        // Extract tournament IDs from the results
        const tournaments = tournamentIds.map(tournament => tournament.tournament_id);

        return tournaments;
    } catch (error) {
        throw new Error(`Error fetching tournaments user is signed up to: ${error.message}`);
    }
}

async function createTournament(tournamentData, sponsor, userEmail) {
    try {
        // Verify user email with the token
        const user = await Users.findOne({ where: { email: userEmail } });
        if (!user) {
            return { status: "error", message: "Invalid user email", data: {} };
        }

        console.log(tournamentData);

        const properTournamentData = {
            name: tournamentData.name,
            discipline: tournamentData.discipline,
            time: tournamentData.date,
            geo_coordinates: tournamentData.coordinates,
            location: tournamentData.location,
            max_participants: tournamentData.max_participants,
            app_deadline: tournamentData.app_deadline,
            creator: tournamentData.creator,
        };

        // Create tournament
        const createdTournament = await Tournaments.create({
            ...properTournamentData
        });

        // Get tournament ID
        const tournamentId = createdTournament.id;
        console.log(tournamentId);


        if (sponsor) {
            // Check if sponsor exists in the database
            const sponsorExists = await Sponsors.findOne({ where: { name: sponsor.name } });
            
            console.log(sponsorExists);

            if (!sponsorExists) {
                // Create sponsor if it does not exist
                await Sponsors.create({
                    name: sponsor.name,
                    logo: sponsor.logo,
                    website: sponsor.website
                });
            }
            
            // Now sponsor exists in the database for sure
            await TournamentSponsors.create({
                tournament_id: tournamentId,
                sponsor_name: sponsor.name, 
            }, { fields: ['tournament_id', 'sponsor_name'] });
            
        }

        return { status: "success", message: "Tournament created successfully", data: createdTournament };
    } catch (error) {
        throw new Error(`Error creating tournament: ${error.message}`);
    }
}

async function getTournamentDetailsById(tournamentId) {
    try {
        // Implement logic to fetch tournament details by ID
        const tournamentDetails = await Tournaments.findOne({
            where: { id: tournamentId },
        });

        return tournamentDetails;
    } catch (error) {
        throw new Error(`Error fetching tournament details by ID: ${error.message}`);
    }
}

async function getSponsorsByTournamentId(tournamentId) {
    try {
        const sponsors_name = await TournamentSponsors.findAll({
            where: { tournament_id: tournamentId },
            attributes: ['sponsor_name'],
        });

        // Now from Sponsor table get the sponsor details
        const sponsors = await Sponsors.findAll({
            where: { name: sponsors_name.map(sponsor => sponsor.sponsor_name) },
        });

        return sponsors;
    } catch (error) {
        throw new Error(`Error fetching sponsors by tournament ID: ${error.message}`);
    }
}

async function isUserSignedUpToTournament(email, tournamentId) {
    try {
        // Implement logic to check if user is signed up to the tournament
        const participant = await TournamentParticipants.findOne({
            where: {
                tournament_id: tournamentId,
                participant: email,
            }, attributes: ['participant'],
        });

        return participant !== null;
    } catch (error) {
        throw new Error(`Error checking if user is signed up to the tournament: ${error.message}`);
    }
}

async function checkIfUserIsSignedUpToTournament(email, tournamentId) {
    try {
        const isSignedUp = await isUserSignedUpToTournament(email, tournamentId);

        return isSignedUp;
    } catch (error) {
        throw new Error(`Error checking if user is signed up to the tournament: ${error.message}`);
    }
}

async function isUserTournamentCreator(email, tournamentId) {
    try {
        // Implement logic to check if user is the creator of the tournament
        const tournament = await Tournaments.findOne({
            where: {
                id: tournamentId,
                creator: email,
            }
        });

        return tournament !== null;
    } catch (error) {
        throw new Error(`Error checking if user is the creator of the tournament: ${error.message}`);
    }
}

async function signUpUserToTournament(email, tournamentId) {
    try {
        // Check if the user is already signed up for the tournament
        const isSignedUp = await TournamentParticipants.findOne({
            where: {
                tournament_id: tournamentId,
                participant: email,
            }, attributes: ['participant'],
        });

        if (isSignedUp) {
            return { "status": "error", "message": "User is already signed up for the tournament", "data": {} };
        }

        // Check if the tournament exists
        const tournament = await Tournaments.findByPk(tournamentId);

        if (!tournament) {
            return { "status": "error", "message": "Tournament does not exist", "data": {} };
        }

        // Check if the tournament has reached its maximum participants limit
        const participantsCount = await TournamentParticipants.count({
            where: {
                tournament_id: tournamentId,
            }
        });

        if (participantsCount >= tournament.max_participants) {
            return { "status": "error", "message": "Tournament has reached its maximum participants limit", "data": {} };
        }

        // Sign up user for the tournament
        await TournamentParticipants.create({
            tournament_id: tournamentId,
            participant: email,
        }, { fields: ['tournament_id', 'participant'] });

        return { "status": "success", "message": "Signed up to tournament successfully!", "data": {} };
    } catch (error) {
        throw new Error(`Error signing up user to the tournament: ${error.message}`);
    }
}

async function getTournamentParticipants(tournamentId) {
    try {
        // Implement logic to fetch tournament participants
        const participants = await TournamentParticipants.findAll({
            where: {
                tournament_id: tournamentId,
            },
            attributes: ['participant'],
        });

        return participants.map(participant => participant.participant);
    } catch (error) {
        throw new Error(`Error fetching tournament participants: ${error.message}`);
    }
}





export { 
    createUser, 
    addParticipantToTournament, 
    createSponsor, 
    addSponsorToTournament, 
    recordTournamentResults, 
    getAllTournaments,
    signUp,
    signIn,
    verifyAccount,
    getListOfTournamentsUserIsSignedUpTo,
    createTournament,
    getTournamentDetailsById,
    getSponsorsByTournamentId,
    isUserSignedUpToTournament,
    checkIfUserIsSignedUpToTournament,
    isUserTournamentCreator,
    signUpUserToTournament,
    getTournamentParticipants
};
