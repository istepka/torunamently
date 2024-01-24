import express from "express";
import mysql from "mysql2";
import fs from "fs";
import cors from "cors";
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken';

import { hashPassword, comparePassword } from "./utils/crypt.js";
import { getRandomValues } from "crypto";

const app = express()

const secret = "123"

app.use(express.json())
app.use(cors())

const rawConfig = fs.readFileSync("./db_config.json")
const dbConfig = JSON.parse(rawConfig)
console.log(dbConfig)

const emailCredentials = JSON.parse(fs.readFileSync("./email_config.json"))
// console.log(emailCredentials)

const db = mysql.createConnection(dbConfig)

db.connect((err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("Database connected!")
    }
})

app.get("/", (req, res) => {
    res.send("Hello World Backend!");
})

app.get("/get_all_tournaments", (req, res) => {
    db.query("SELECT * FROM tournamently.TOURNAMENTS", (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post("/sign_up", async (req, res) => {
    const {email, password} = req.body
    const hashedPassword = await hashPassword(password)

    console.log(email, password, hashedPassword)

    db.query("INSERT INTO tournamently.USERS (email, password) VALUES (?, ?)", [email, hashedPassword], async (err, result) => {
        if (err) {
            console.log(err)
            res.send({"status": "error", "message": "Error", "token": ""})
        } else {
           

            // Send verification email
            const transporter = nodemailer.createTransport({
                host: "smtp.wp.pl",
                port: 465,
                secure: true,
                auth: {
                    user: emailCredentials.email,
                    pass: emailCredentials.password
                }
            })

            var token = getRandomValues(new Uint8Array(16)).join("")

            db.query("UPDATE tournamently.USERS SET verification_token = ? WHERE email = ?", [token, email], (err, result) => {
                if (err) {
                    console.log(err)
                    res.send({"status": "error", "message": "Database error", "token": ""})
                }
            })

            const mailOptions = {
                from: emailCredentials.email,
                to: email,
                subject: 'Tournamently Account Verification',
                text: 'Click the link below to verify your account:\nhttp://localhost:8801/verify_account?email=' + email + '&token=' + token
            };

            try {
                await transporter.sendMail(mailOptions);
                const mess = "Account created successfully!\nA verification email has been sent to " + email + " .\nYou need to verify your account before logging in!"
                res.send({"status": "success", "message": mess, "token": ""})
            } catch (error) {
                console.error('Error sending email:', error);
                const mess = "There was an error while sending the verification email!\nPlease try again later!"
                // TODO: Delete the user from the database, since the email was not sent
                res.send({"status": "error", "message": mess, "token": ""})
            }


        }
    })
})

app.post("/sign_in", async (req, res) => {
    const {email, password} = req.body
    // First check if the email exists
    // Then check if the password matches
    // Then check if user account is verified   

    const hashedPassword = await hashPassword(password)

    db.query("SELECT * FROM tournamently.USERS WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0) {
                // Email exists
                console.log(result[0].password, hashedPassword)
                if (result[0].password === hashedPassword) {
                    // Password matches
                    if (result[0].verified === 1) {
                        // Account is verified

                        // Generate JWT token
                        const token = jwt.sign({ email }, secret, { expiresIn: '1h' });

                        res.send({"status": "success", "message": "Login successful!", "token": token})
                    } else {
                        // Account is not verified
                        res.send({"status": "error", "message": "Account is not verified!", "token": ""})
                    }
                } else {
                    // Password does not match
                    res.send({"status": "error", "message": "Password does not match!", "token": ""})
                }
            } else {
                // Email does not exist
                res.send({"status": "error", "message": "Email does not exist!", "token": ""})
            }
        }
    })

})

app.get("/verify_account", (req, res) => {
    const {email, token} = req.query

    // Check if email exists
    // Check if token matches
    // If both are true, then update verified column to 1
    console.log(email, token)


    db.query("SELECT * FROM tournamently.USERS WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0) {
                // Email exists
                if (result[0].verification_token === token) {
                    // Token matches
                    db.query("UPDATE tournamently.USERS SET verified = 1 WHERE email = ?", [email], (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            res.send({"status": "success", "message": "Account verified successfully!"})
                        }
                    })
                } else {
                    // Token does not match
                    res.send({"status": "error", "message": "Token does not match!"})
                }
            } else {
                // Email does not exist
                res.send({"status": "error", "message": "Email does not exist!"})
            }
        }
    })
})

app.get("/get_list_of_tournaments_user_is_signed_up_to", (req, res) => {
    const {token, email} = req.query

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            console.log(err)
            res.send({"status": "error", "message": "Invalid token", "data": []})
        } else {
            if (decoded.email === email) {
                // Token is valid

               const sqlquery = "SELECT id FROM tournamently.TOURNAMENTS WHERE id IN (SELECT tournament_id FROM tournamently.TOURNAMENT_PARTICIPANTS WHERE participant = ?)"

                db.query(sqlquery, [email], (err, result) => {
                    if (err) {
                        console.log(err)
                        res.send({"status": "error", "message": "Database error", "data": []})
                    } else {
                        
                        if (result.length > 0) {
                            // User is signed up to at least one tournament
                            // [ { id: 1 } ]
                            var tournaments = []
                            for (var i = 0; i < result.length; i++) {
                                tournaments.push(result[i].id)
                            }
                            console.log(tournaments)
                            res.send({"status": "success", "message": "Success", "data": tournaments})
                        }
                        else { // [ ]
                            // User is not signed up to any tournament
                            console.log(result)
                            res.send({"status": "success", "message": "Success", "data": []})
                        }
                    }
                })
            } else {
                // Token is invalid
                res.send({"status": "error", "message": "Invalid token", "data": []})
            }
        }
    })
})

app.post("/create_tournament", (req, res) => {
    const tournamentData = req.body.tournamentData
    const sponsors = req.body.sponsors
    const token = req.body.token

    jwt.verify(token, secret, (err, decoded) => {
    })
})




app.listen(8801, () => {
    console.log("Backend server is running! Port: 8801");
})