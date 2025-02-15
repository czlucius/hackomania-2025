import "dotenv/config";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { AIProvider, Ingredient, LLMProvider, Meal } from "./types";

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
const IngredientCheck = z.object({
  name: z.array(z.string()),
});
export class OAILLProvider implements LLMProvider {
  private apiKey: string;
  private openai = new OpenAI();

  constructor(apiKey: string) {
    this.apiKey = apiKey;

    this.openai = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  async multimodalContent(prompt: string, b64Image: string): Promise<string> {
    const dataUrl = `data:image/jpeg;base64,${b64Image}`;
    // console.log(dataUrl);
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
              },
            },
          ],
        },
      ],
      store: true,
      // @ts-ignore
      response_format: zodResponseFormat(IngredientCheck, "ingredient"),
    });

    console.log("resp", response);
    console.log(response.choices[0].message.parsed);
    return response.choices[0].message.content ?? "";
  }

  async generateContent(prompt: string): Promise<string> {
    // Pass it into GPT-4o
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }],
        },
      ],
      store: true,
    });
    return response.choices[0].message.content ?? "";
  }
}

export class AIFeatureProvider implements AIProvider {
  private llmProvider: LLMProvider;
  constructor(apiKey: string) {
    this.llmProvider = new OAILLProvider(apiKey);
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

    let responseStr = await this.llmProvider.generateContent(prompt);
    responseStr = responseStr.replace("```json", "").replace("```", "");
    console.log("Response", responseStr);
    const jsonParsed = JSON.parse(responseStr);
    return jsonParsed;
  }

  async analyzeImage(imageData: string): Promise<Ingredient[]> {
    // Assume imageData is a base64 encoded image
    let response = await this.llmProvider.multimodalContent(
      `Analyze the image and return the ingredients. The image is of leftover food and include all the ingredients in the image(e.g. vegetables, rice, bread)

      Return the response in the following JSON format:

        ["Ingredient 1", "Ingredient 2", "Ingredient 3"]
      `,
      imageData,
    );
    console.log(response);
    response = response.replace("```json", "").replace("```", "");
    const parsed = JSON.parse(response);

    return parsed;
  }

  async rankRecipes(
    recipes: Meal[],
    ingredients: Ingredient[],
  ): Promise<string> {
    // TODO: Implement recipe ranking with Gemini
    const rankingScores = {};

    // Get the scores
    for (const recipe of recipes) {
      // prompt engineering
      let stringOfRecipe = `${recipe.strMeal} ${recipe.strCategory} ${recipe.strInstructions}

      Ingredients:`;
      let stringOfIngredients = "";
      // console.log("my ingredients are ,", ingredients, JSON.stringify(ingredients))
      for (const ingredient of ingredients) {
        const each = `${ingredient.name} (Quantity: ${ingredient.quantity})
`;
        stringOfIngredients += each;
      }

      for (const ingredient of recipe.ingredients) {
        const each = `${ingredient.name} (Quantity: ${ingredient.quantity})
`;
        stringOfRecipe += each;
      }

      const prompt = `${stringOfRecipe}\n\nhello gemini, the above is a receipe. below is a list of ingredients we have:\n\n${stringOfIngredients}. Please return a score of 1 to 100 of how similar the ingredients matches the recipe. You must only return an integer and only a number. DONT describe why you rank it that way. DONT put the percentage sign with the number.`;
      // console.log("our prompt", prompt)
      // continue

      // query a gemini
      const score = await this.llmProvider.generateContent(prompt);
      console.log(score);
      rankingScores[recipe.strMeal] = Number(score.trim());
    }
    console.log(rankingScores);

    // alert(rankingScores);
    return getNameWithHighestScore(rankingScores);
  }
}
