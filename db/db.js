import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const {CONNECTION_URL} = process.env;
const client = new MongoClient(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

function getClient() {
    return client;
}

async function close() {
    try {
        await client.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
    }
}

export { connect, getClient, close };
