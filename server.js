import express from "express";
import * as db from "./db/db.js";
import { recipesRouter } from "./routes/recipes.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
const { PORT } = process.env

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "public")));

server.use("/api", recipesRouter);

server.listen(PORT, async (err) => {
    if (err) {
        return console.error("Failed to start server")
    }
    await db.connect();
    console.log("Server running...");
});

process.on('SIGINT', async () => {
    await db.close();
    process.exit(0);
});