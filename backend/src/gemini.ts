import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import { AIProvider, Ingredient, Meal } from "./types";
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
    availableIngredients: Ingredient[],
  ): Promise<Meal[]> {
    // TODO: Implement recipe ranking with Gemini
    return [];
  }
}
