import express from "express";
import fs from "fs";
import cors from "cors";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

import { hashPassword, comparePassword } from "./utils/crypt.js";
import { getRandomValues } from "crypto";
import { 
    getAllTournaments, signUp, 
    signIn, verifyAccount, 
    getListOfTournamentsUserIsSignedUpTo, 
    createTournament, getTournamentDetailsById,
    getSponsorsByTournamentId, checkIfUserIsSignedUpToTournament,
    isUserTournamentCreator, signUpUserToTournament,
    getTournamentParticipants, updateTournament,
    getLadder, getResultsForTournament, 
    updateMatchupScore, addMatchup,
    getUserByEmail,
    resetPassword,
    updateVerificationToken, checkIfLadderExists
} from "./utils/db_ops.js";

const app = express()

const secret = "123"

app.use(express.json())
app.use(cors())

const emailCredentials = JSON.parse(fs.readFileSync("./email_config.json"))


app.get("/", (req, res) => {
    res.send("Hello World Backend!");
})

app.get("/get_all_tournaments", async (req, res) => {
    try {
        const tournaments = await getAllTournaments();
        res.send(tournaments);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/sign_up", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Call signUp function to create user
        const user = await signUp(email, password);

        // Send verification email
        const transporter = nodemailer.createTransport({
            host: "smtp.wp.pl",
            port: 465,
            secure: true,
            auth: {
                user: emailCredentials.email,
                pass: emailCredentials.password,
            },
        });

        const token = getRandomValues(new Uint8Array(16)).join("");

        // Update user with verification token
        await user.update({ verification_token: token });

        const mailOptions = {
            from: emailCredentials.email,
            to: email,
            subject: 'Tournamently Account Verification',
            text: 'Click the link below to verify your account:\nhttp://localhost:8801/verify_account?email=' + email + '&token=' + token
        };

        await transporter.sendMail(mailOptions);

        const message = "Account created successfully!\nA verification email has been sent to " + email + ".\nYou need to verify your account before logging in!";
        res.send({ "status": "success", "message": message, "token": "" });
    } catch (error) {
        console.error('Error during sign up:', error);

        const message = "There was an error during sign up!\nPlease try again later!";
        // TODO: Delete the user from the database, since the sign-up process was not completed
        res.send({ "status": "error", "message": message, "token": "" });
    }
});

app.post("/sign_in", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Call signIn function to authenticate user
        const result = await signIn(email, password);

        res.send(result);
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/verify_account", async (req, res) => {
    const { email, token } = req.query;

    try {
        // Call verifyAccount function to verify the account
        const result = await verifyAccount(email, token);

        // Return simple html page
        
        if (result) {
            res.send("<h1>Account verified successfully!</h1><p>You can now safely close this tab and log in to Tournamently!</p>");
        }
        else {
            res.send("<h1>Account verification failed!</h1>");
        }

    } catch (error) {
        console.error('Error during account verification:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/verify_token", async (req, res) => {
    const { token } = req.query;

    try {
        // Verify JWT token
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": {} });
            } else {
                // Token is valid
                res.send({ "status": "success", "message": "Success", "data": {} });
            }
        });
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/forgot_password", async (req, res) => {
    const { email } = req.body;

    try {
        // Check if user exists
        const user = await getUserByEmail(email);
        if (user === null) {
            res.send({ "status": "success", "message": "If the email exists, you will receive an email with a link to reset your password!", "data": {} });
            return;
        }

        // Send password reset email
        const transporter = nodemailer.createTransport({
            host: "smtp.wp.pl",
            port: 465,
            secure: true,
            auth: {
                user: emailCredentials.email,
                pass: emailCredentials.password,
            },
        });

        const token = getRandomValues(new Uint8Array(16)).join("");

        // Update user with password reset token
        const updateRes  = await user.update({ verification_token: token });

        if (!updateRes) {
            res.send({ "status": "error", "message": "Database error", "data": {} });
            return;
        }

        const mailOptions = {
            from: emailCredentials.email,
            to: email,
            subject: 'Tournamently Password Reset',
            text: 'Click the link below to reset your password:\nhttp://localhost:3000/reset_password?email=' + email + '&token=' + token
        };

        await transporter.sendMail(mailOptions);

        const message = "If the email exists, you will receive an email with a link to reset your password!";
        res.send({ "status": "success", "message": message, "data": {} });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/reset_password", async (req, res) => {
    const { email, token, password } = req.body;

    try {
        // Check if user exists
        const user = await getUserByEmail(email);
        if (user === null) {
            res.send({ "status": "error", "message": "Invalid email", "data": {} });
            return;
        }

        // Check if token is valid
        if (user.verification_token !== token) {
            res.send({ "status": "error", "message": "Invalid token", "data": {} });
            return;
        }

        // Update user password
        const hashedPassword = await hashPassword(password);
       
        const updateRes = await resetPassword(email, hashedPassword);
        if (!updateRes) {
            res.send({ "status": "error", "message": "Database error", "data": {} });
            return;
        }

        const message = "Password reset successfully!";
        res.send({ "status": "success", "message": message, "data": {} });
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/get_list_of_tournaments_user_is_signed_up_to", async (req, res) => {
    const { token, email } = req.query;
    console.log("email: " + email);
    console.log("token: " + token);

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": [] });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": [] });
            } else {
                if (decoded.email === email) {
                    // Token is valid

                    try {
                        // Call getListOfTournamentsUserIsSignedUpTo function to get the list of tournaments
                        const tournaments = await getListOfTournamentsUserIsSignedUpTo(email);

                        // Send the structured response
                        res.send({ "status": "success", "message": "Success", "data": tournaments });
                    } catch (error) {
                        console.error('Error fetching tournaments:', error);
                        res.send({ "status": "error", "message": "Database error", "data": [] });
                    }
                } else {
                    // Token is invalid
                    res.send({ "status": "error", "message": "Invalid token", "data": [] });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/create_tournament", async (req, res) => {
    const tournamentData = req.body.tournamentData;
    const sponsor = req.body.sponsors;
    const token = req.body.token;

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": {} });
            } else {
                try {
                    // Call createTournament function to handle tournament creation
                    const result = await createTournament(tournamentData, sponsor, decoded.email);

                    // Send the structured response
                    res.send(result);
                } catch (error) {
                    console.error('Error creating tournament:', error);
                    res.send({ "status": "error", "message": "Internal Server Error", "data": {} });
                }
            }
        });
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": {} });
    }
});

app.post("/check_if_user_is_logged_in", async (req, res) => {
    const token = req.body.token;

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": {} });
            } else {
                // Token is valid
                res.send({ "status": "success", "message": "Success", "data": {} });
            }
        });
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": {} });
    }
});

app.get("/get_tournament_details", async (req, res) => {
    const { id, token } = req.query;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": {} });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": {} });
            } else {
                // Token is valid

                try {
                    // Implement logic to fetch tournament details by ID
                    // Assuming you have a function named getTournamentDetailsById in db_ops.js
                    const tournamentDetails = await getTournamentDetailsById(id);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": { tournament: tournamentDetails } });
                } catch (error) {
                    console.error('Error fetching tournament details:', error);
                    res.send({ "status": "error", "message": "Database error", "data": {} });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/get_tournament_sponsors", async (req, res) => {
    const { id, token } = req.query;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": [] });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": [] });
            } else {
                // Token is valid

                try {
                    const sponsors = await getSponsorsByTournamentId(id);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": sponsors });
                } catch (error) {
                    console.error('Error fetching sponsors:', error);
                    res.send({ "status": "error", "message": "Database error", "data": [] });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/check_if_signed_up_to_tournament", async (req, res) => {
    const { token, email, tournamentId } = req.body;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": false });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": false });
            } else {

                try {
                    const isSignedUp = await checkIfUserIsSignedUpToTournament(email, tournamentId);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": isSignedUp });
                } catch (error) {
                    console.error('Error checking if user is signed up to the tournament:', error);
                    res.send({ "status": "error", "message": "Database error", "data": false });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": false });
    }
});

app.post("/check_if_user_is_tournament_creator", async (req, res) => {
    const { token, email, tournamentId } = req.body;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": false });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": false });
            } else {
                // Token is valid

                try {
                    // Implement logic to check if user is the creator of the tournament
                    // Assuming you have a function named isUserTournamentCreator in db_ops.js
                    const isCreator = await isUserTournamentCreator(email, tournamentId);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": isCreator });
                } catch (error) {
                    console.error('Error checking if user is the creator of the tournament:', error);
                    res.send({ "status": "error", "message": "Database error", "data": false });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": false });
    }
});

app.post("/sign_up_to_tournament", async (req, res) => {
    const { token, email, tournamentId } = req.body;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": {} });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": {} });
            } else {
                // Token is valid

                try {
                    const signUpResult = await signUpUserToTournament(email, tournamentId);

                    // Send the structured response
                    res.send(signUpResult);
                } catch (error) {
                    console.error('Error signing up user to the tournament:', error);
                    res.send({ "status": "error", "message": "Database error", "data": {} });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": {} });
    }
});

app.get("/get_tournament_participants", async (req, res) => {
    const { id, token } = req.query;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": [] });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": [] });
            } else {
                // Token is valid

                try {
                    const participants = await getTournamentParticipants(id);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": participants });
                } catch (error) {
                    console.error('Error fetching tournament participants:', error);
                    res.send({ "status": "error", "message": "Database error", "data": [] });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": [] });
    }
});

app.post("/update_tournament", async (req, res) => {
    const { id } = req.query;
    const { tournamentData, sponsors, token } = req.body;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": {} });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": {} });
            } else {
                // Token is valid

                try {
                    const updateResult = await updateTournament(id, tournamentData, sponsors);

                    // Send the structured response
                    res.send(updateResult);
                } catch (error) {
                    console.error('Error updating tournament:', error);
                    res.send({ "status": "error", "message": "Database error", "data": {} });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send({ "status": "error", "message": "Internal Server Error", "data": {} });
    }
});

// Get or create ladder out of tournament participants
app.get("/fetch_ladder", async (req, res) => {
    const { token, tournament_id } = req.query;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": [] });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": [] });
            } else {
                // Token is valid

                try {
                    const ladder = await getLadder(tournament_id);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": ladder });
                } catch (error) {
                    console.error('Error fetching ladder:', error);
                    res.send({ "status": "error", "message": "Database error", "data": [] });
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/check_if_ladder_exists", async (req, res) => {
    const { token, tournament_id } = req.query;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token"});
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.send({ "status": "error", "message": "Invalid token"});
            } else {
                // Token is valid

                try {
                    const ladderExists = await checkIfLadderExists(tournament_id);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Yes", "data": ladderExists});
                } catch (error) {
                    console.error('Error fetching ladder:', error);
                    res.send({ "status": "error", "message": "Database error"});
                }
            }
        })
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }
});
// Get records for a tournament from tournament results table
app.get("/fetch_results_for_tournament", async (req, res) => {
    const { token, tournament_id } = req.query;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token", "data": [] });
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                console.log(err);
                res.send({ "status": "error", "message": "Invalid token", "data": [] });
            } else {
                // Token is valid

                try {
                    const results = await getResultsForTournament(tournament_id);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success", "data": results });
                }
                catch (error) {
                    console.error('Error fetching results:', error);
                    res.send({ "status": "error", "message": "Database error", "data": [] });
                }
            }
        }
        )
    } catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }

});


app.post("/update_matchup_score", async (req, res) => {
    const { token, tournament_id, participant1, participant2, score1, score2, verified} = req.body;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token"});
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.send({ "status": "error", "message": "Invalid token"});
            } else {
                // Token is valid

                try {
                    const results = await updateMatchupScore(tournament_id, participant1, participant2, score1, score2, verified);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success"});
                }
                catch (error) {
                    console.error('Error updating matchup score:', error);
                    res.send({ "status": "error", "message": "Database error"});
                }
            }
        }
        )
    }
    catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }

});


app.post("/add_matchup", async (req, res) => {
    const { token, tournament_id, participant1, participant2} = req.body;

    // Check if token is undefined
    if (token === undefined) {
        res.send({ "status": "error", "message": "Invalid token"});
        return;
    }

    try {
        // Verify JWT token
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                res.send({ "status": "error", "message": "Invalid token"});
            } else {
                // Token is valid

                try {
                    const results = await addMatchup(tournament_id, participant1, participant2);

                    // Send the structured response
                    res.send({ "status": "success", "message": "Success"});
                }
                catch (error) {
                    console.error('Error adding matchup:', error);
                    res.send({ "status": "error", "message": "Database error"});
                }
            }
        }
        )
    }
    catch (error) {
        console.error('Error during token verification:', error);
        res.status(500).send("Internal Server Error");
    }

}
);

app.listen(8801, () => {
    console.log("Backend server is running! Port: 8801");
})