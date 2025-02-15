import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { AIProvider, Ingredient, Meal } from "./types";

function getNameWithHighestScore(scores) {
  if (!scores || Object.keys(scores).length === 0) {
    return null;
  }

  let highestScore = -1; // Initialize to -1 (or any value < 0) since scores are 0-100
  let highestScoreName = null;

  for (const name in scores) {
    if (scores.hasOwnProperty(name)) {
      const score = scores[name];

      if (typeof score !== "number" || isNaN(score)) {
        // Check for non-numeric or NaN
        console.warn(`Score for ${name} is not a number. Skipping.`);
        continue;
      }
      if (score < 0 || score > 100) {
        console.warn(`Score for ${name} is out of range. Skipping.`);
        continue;
      }

      if (score > highestScore) {
        highestScore = score;
        highestScoreName = name;
      }
    }
  }

  return highestScoreName;
}

export class GeminiProvider implements AIProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateRecipe(ingredients: Ingredient[]): Promise<Meal[]> {
    /*
    export interface Ingredient {
      id: string;
      name: string;
      quantity?: string;
      unit?: string;
    } */
    // Make sure to include these imports:
    // import { GoogleGenerativeAI } from "@google/generative-ai";
    const genAI = new GoogleGenerativeAI(this.apiKey ?? "");

    const model = genAI.getGenerativeModel({
      model: "tunedModels/leftover-culinary-genius-3-270gzry2gonu",
    });

    const ingredientList = ingredients
      .map((ing) => {
        if (ing.quantity) {
          return `${ing.quantity} ${ing.name}`;
        }
        return ing.name;
      })
      .join(", ");
    /*
    export interface Meal {
      idMeal: "1";
      strMeal: string;
      strCategory: string;
      strArea: string;
      strInstructions: string;
      strMealThumb: string;
      strYoutube: string;
      ingredients: { name: string; measure: string }[];
    }
    */
    const prompt = `Given these ingredients: ${ingredientList}

Please generate a recipe that uses some or all of these ingredients. Return the response in the following JSON format:

{
  "strMeal": "Recipe Title",
  "servings": "Number of servings",
  "prepTime": "Prep time in minutes",
  "cookTime": "Cook time in minutes",
  "strCategory": "Category of meal",
  "strArea": "Area of origin",
  "ingredients": [
    {
      "name": "Ingredient name",
      "quantity": "Amount and unit of measurement",
      "qraw": "Raw quantity",
      "unit": "Unit of measurement"
    }
  ],
  "strInstructions": "Step-by-step instructions for preparing the recipe",
  "notes": "Any additional notes or tips"
}

Ensure all JSON fields are properly formatted and the recipe is practical and feasible.`;

    const result = await model.generateContent(prompt);
    let responseStr = result.response.text();
    responseStr = responseStr.replace("```json", "").replace("```", "");
    console.log("Response", responseStr);
    const jsonParsed = JSON.parse(responseStr);
    return jsonParsed;
  }

  async analyzeImage(imageData: string): Promise<Ingredient[]> {
    // TODO: Implement Gemini Vision API call
    return [];
  }

  async rankRecipes(
    recipes: Meal[],
    ingredients: Ingredient[],
  ): Promise<Meal[]> {
    // TODO: Implement recipe ranking with Gemini
    const rankingScores = {};

    // Get the scores
    for (const recipe of recipes) {
      // prompt engineering
      const stringOfRecipe = `${recipe.strMeal} ${recipe.strCategory} ${recipe.strInstructions} ${recipe.strIngredients}`;
      let stringOfIngredients = "";
      // console.log("my ingredients are ,", ingredients, JSON.stringify(ingredients))
      for (const ingredient of ingredients) {
        const each = `${ingredient.name} (Quantity: ${ingredient.quantity})
`;
        stringOfIngredients += each;
      }

      const prompt = `${stringOfRecipe}\n\nhello gemini, the above is a receipe. below is a list of ingredients we have:\n\n${stringOfIngredients}. Please return a score of 1 to 100 of how similar the ingredients matches the recipe. You must only return an integer and only a number. DONT describe why you rank it that way. DONT put the percentage sign with the number.`;
      // console.log("our prompt", prompt)
      // continue

      // query a gemini
      const result = await model.generateContent(prompt);
      console.log(recipe.strMeal);
      const score = result.response.text();
      console.log(score);
      rankingScores[recipe.strMeal] = Number(score.trim());
    }
    console.log(rankingScores);

    // alert(rankingScores);
    return getNameWithHighestScore(rankingScores);
  }
}
