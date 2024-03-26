import express from "express";
import { getClient } from "../db/db.js";
import { ObjectId } from "mongodb";

export const recipesRouter = express.Router();
const recipes = getClient().db("lab1").collection("recipes");

recipesRouter.get("/recipes", async (_, res) => {
    try {
        const result = await recipes.find({}).toArray();
        res.status(200).json(result);
    } catch {
        res.status(500).send("Server Error - Couldn't handle the request");
    }
});

recipesRouter.get("/recipes/:title", async (req, res) => {
    try {
        const { title } = req.params;
        const result = await recipes.find({ title }).toArray();

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).send("Recipe not found!")
        }
    } catch {
        res.status(500).send("Server Error - Couldn't handle the request");
    }
});

recipesRouter.post("/recipes", async (req, res) => {
    try {
        const { title, ingredients, instructions, cookingTime } = req.body;
        const recipeExists = Boolean((await recipes.findOne({ title })));

        if (recipeExists) {
            return res.status(409).send("Recipe already exists!");
        }

        if (title && ingredients && instructions && cookingTime) {
            await recipes.insertOne({ title, ingredients, instructions, cookingTime });
            res.status(201).send("Recipe added!");
        } else {
            res.status(401).send("Fields are incorrect! Can't add recipe.")
        }
    } catch {
        res.status(500).send("Server Error - Couldn't handle the request");
    }
});

recipesRouter.put("/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }

        const _id = new ObjectId(id);
        const recipeExists = Boolean((await recipes.findOne({ _id })));

        if (!recipeExists) {
            return res.status(404).send("Recipe does not exist!");
        }

        const { title, ingredients, instructions, cookingTime } = req.body;

        if (title && ingredients && instructions && cookingTime) {
            await recipes.updateOne({ _id }, { $set: { title, ingredients, instructions, cookingTime } });
            res.status(200).send("Recipe updated!");
        } else {
            res.status(401).send("Fields are incorrect! Can't update recipe.")
        }
    } catch {
        res.status(500).send("Server Error - Couldn't handle the request");
    }
});

recipesRouter.delete("/recipes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).send("Invalid ID");
        }

        const _id = new ObjectId(id);
        const recipeExists = Boolean((await recipes.findOne({ _id })));

        if (!recipeExists) {
            return res.status(404).send("Recipe does not exist!");
        }

        await recipes.deleteOne({ _id });
        res.status(200).send("Recipe deleted!");
    } catch {
        res.status(500).send("Server Error - Couldn't handle the request");
    }
});