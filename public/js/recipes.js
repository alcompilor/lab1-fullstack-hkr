const fetchRecipes = async () => {
    try {
        const response = await fetch("/api/recipes");
        const recipes = await response.json();

        const tableBody = document.querySelector(".recipes-table > tbody");
        tableBody.innerHTML = "";

        recipes.forEach((recipe) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${recipe.title}</td>
                <td>${recipe.ingredients}</td>
                <td>${recipe.instructions}</td>
                <td>${recipe.cookingTime}</td>
                <td>
                    <button onclick="updateRecipe('${recipe._id}', '${recipe.title}', '${recipe.ingredients}', '${recipe.instructions}', '${recipe.cookingTime}')">Update</button>
                    <button onclick="deleteRecipe('${recipe._id}')">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

const deleteRecipe = async (recipeId) => {
    const isConfirmed = confirm("Are you sure that you want to delete this recipe?");

    if (isConfirmed) {
        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchRecipes();
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    }
}

const updateRecipe = async (recipeId, title, ingredients, instructions, cookingTime) => {
    const newTitle = prompt("Recipe title:", title);
    const newIngredients = prompt("Ingredients:", ingredients);
    const newInstructions = prompt("Instructions:", instructions);
    const newCookingTime = prompt("Cooking time:", cookingTime);

    if (newTitle && newIngredients && newInstructions && newCookingTime) {
        const newRecipe = {
            title: newTitle,
            ingredients: newIngredients,
            instructions: newInstructions,
            cookingTime: newCookingTime
        };

        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            });

            if (response.ok) {
                fetchRecipes();
            } else {
                console.error(response.statusText);
            }
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    }
}

document.querySelector(".add-recipe").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const recipe = {
        title: formData.get("title"),
        ingredients: formData.get("ingredients"),
        instructions: formData.get("instructions"),
        cookingTime: parseInt(formData.get("cookingTime"))
    };

    try {
        const response = await fetch("/api/recipes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(recipe)
        });

        if (response.ok) {
            fetchRecipes();
            e.target.reset();
        } else {
            console.error(response.statusText);
        }
    } catch (error) {
        console.error("Error adding recipe:", error);
    }
});

fetchRecipes();