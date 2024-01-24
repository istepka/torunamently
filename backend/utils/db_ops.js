import mysql from "mysql2";


function get_all_tournaments(db) {
    return new Promise((resolve, reject) => {
        db.query("SELECT * FROM tournamently.TOURNAMENTS", (err, result) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}