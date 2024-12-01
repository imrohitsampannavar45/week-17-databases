"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const pgClient = new pg_1.Client({
    connectionString: "postgresql://neondb_owner:MEnI3GlkN1Ze@ep-royal-leaf-a5cqfatm.us-east-2.aws.neon.tech/neondb?sslmode=require"
});
app.use(express_1.default.json());
pgClient.connect();
// Signup route
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, email, city, country, street, pincode } = req.body;
    const userInsertQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`;
    const addressInsertQuery = `INSERT INTO addresses (city, country, street, pincode, user_id) VALUES ($1, $2, $3, $4, $5);`;
    try {
        yield pgClient.query("BEGIN;");
        const userResponse = yield pgClient.query(userInsertQuery, [username, email, password]);
        const userId = userResponse.rows[0].id;
        // For testing long transaction
        yield new Promise(x => setTimeout(x, 1000));
        yield pgClient.query(addressInsertQuery, [city, country, street, pincode, userId]);
        yield pgClient.query("COMMIT;");
        res.json({ message: "You are signed up" });
    }
    catch (error) {
        yield pgClient.query("ROLLBACK;");
        res.status(500).json({ error: "Signup failed" });
        console.error(error);
    }
}));
// Metadata route
app.get("/metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const userQuery = `SELECT username, email, id FROM users WHERE id = $1;`;
    const addressQuery = `SELECT * FROM addresses WHERE user_id = $1;`;
    try {
        const userResponse = yield pgClient.query(userQuery, [parseInt(id)]);
        const addressResponse = yield pgClient.query(addressQuery, [parseInt(id)]);
        res.json({
            user: userResponse.rows[0],
            address: addressResponse.rows[0]
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch metadata" });
        console.error(error);
    }
}));
// Better metadata route
app.get("/better-metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const query = `SELECT users.username, addresses.city, addresses.country, addresses.street, addresses.pincode
FROM users
LEFT JOIN addresses ON users.id = addresses.user_id;`;
    try {
        const response = yield pgClient.query(query, [parseInt(id)]);
        res.json({ response: response.rows });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch better metadata" });
        console.error(error);
    }
}));
app.listen(3000, () => console.log("Server running on port 3000"));
