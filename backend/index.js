import express from "express";
import mysql from "mysql2";
import fs from "fs";
import cors from "cors";

const app = express()
app.use(express.json())
app.use(cors())

const rawConfig = fs.readFileSync("./db_config.json")
const dbConfig = JSON.parse(rawConfig)
console.log(dbConfig)

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

app.post("/sign_up", (req, res) => {
    const {email, password} = req.body
    db.query("INSERT INTO tournamently.USERS (email, password) VALUES (?, ?)", [email, password], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.send(result)
        }
    })
})

app.post("/sign_in", (req, res) => {
    const {email, password} = req.body
    // First check if the email exists
    // Then check if the password matches
    // Then check if user account is verified

    db.query("SELECT * FROM tournamently.USERS WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.log(err)
        } else {
            if (result.length > 0) {
                // Email exists
                if (result[0].password === password) {
                    // Password matches
                    if (result[0].verified === 1) {
                        // Account is verified
                        res.send({"status": "success", "message": "Login successful!", "token": "PLACEHOLDER_TOKEN"})
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



app.listen(8801, () => {
    console.log("Backend server is running! Port: 8801");
})