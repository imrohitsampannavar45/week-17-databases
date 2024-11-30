import { Client } from "pg";
import express from "express"

const app = express()
const pgClient = new Client("your-postgres-password")

app.use(express.json())

pgClient.connect();

// const pgClient = new Client({
//     host: '@ep-royal-leaf-a5cqfatm.us-east-2.aws.neon.tech',
//     port: 5432,
//     database: 'neondb',
//     user: 'neondb_owner',
//     password: 'your-password-',
//     ssl: true
// })

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    const sqlQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`
    const response = await pgClient.query(sqlQuery, [username, email, password]);



    res.json({
        message: "You are signed Up "
    })
})




app.listen(3000, () => console.log("Server Running on port 3000"))