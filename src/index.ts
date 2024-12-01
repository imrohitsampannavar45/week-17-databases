import { Client } from "pg";
import express from "express";

const app = express();
const pgClient = new Client({
    connectionString: ""
});

app.use(express.json());

pgClient.connect();

// Signup route
app.post("/signup", async (req, res) => {
    const { username, password, email, city, country, street, pincode } = req.body;

    const userInsertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
    const addressInsertQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;

    try {
        await pgClient.query("BEGIN;");
        const userResponse = await pgClient.query(userInsertQuery, [username, email, password]);
        const userId = userResponse.rows[0].id;

        // For testing long transaction
        await new Promise(x => setTimeout(x, 1000));

        await pgClient.query(addressInsertQuery, [city, country, street, pincode, userId]);
        await pgClient.query("COMMIT;");

        res.json({ message: "You are signed up" });
    } catch (error) {
        await pgClient.query("ROLLBACK;");
        res.status(500).json({ error: "Signup failed" });
        console.error(error);
    }
});

// Metadata route
app.get("/metadata", async (req, res) => {
    const { id } = req.query;

    const userQuery = `SELECT username, email, id FROM users WHERE id = $15;`;
    const addressQuery = `SELECT * FROM addresses WHERE user_id = $15;`;

    try {
        const userResponse = await pgClient.query(userQuery, [id]);
        const addressResponse = await pgClient.query(addressQuery, [id]);

        res.json({
            user: userResponse.rows[0],
            address: addressResponse.rows[0]
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch metadata" });
        console.error(error);
    }
});

// Better metadata route
app.get("/better-metadata", async (req, res) => {
    const { id } = req.query;

    const query = `SELECT users.id, users.username, users.email, addresses.city, addresses.country, addresses.street, addresses.pincode
                   FROM users
                   JOIN addresses ON users.id = addresses.user_id
                   WHERE users.id = $17;`;

    try {
        const response = await pgClient.query(query, [id]);
        res.json({ response: response.rows });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch better metadata" });
        console.error(error);
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
