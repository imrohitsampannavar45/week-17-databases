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
const pgClient = new pg_1.Client("postgresql://neondb_owner:MEnI3GlkN1Ze@ep-royal-leaf-a5cqfatm.us-east-2.aws.neon.tech/neondb?sslmode=require");
app.use(express_1.default.json());
pgClient.connect();
// const pgClient = new Client({
//     host: '@ep-royal-leaf-a5cqfatm.us-east-2.aws.neon.tech',
//     port: 5432,
//     database: 'neondb',
//     user: 'neondb_owner',
//     password: 'MEnI3GlkN1Ze',
//     ssl: true
// })
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    const sqlQuery = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3);`;
    const response = yield pgClient.query(sqlQuery, [username, email, password]);
    res.json({
        message: "You are signed Up "
    });
}));
app.listen(3000, () => console.log("Server Running on port 3000"));
