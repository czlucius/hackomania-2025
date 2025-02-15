export interface AIProvider {
  generateRecipe(ingredients: Ingredient[]): Promise<Meal[]>;
  analyzeImage(imageData: string): Promise<Ingredient[]>;
  rankRecipes(
    recipes: Meal[],
    availableIngredients: Ingredient[],
  ): Promise<string>;
}

export interface LLMProvider {
  generateContent(prompt: string): Promise<string>;
  multimodalContent(prompt: string, b64Image: string): Promise<string>;
}

export interface Ingredient {
  name: string;
  quantity: string;
  qraw: string;
  unit?: string;
}

export interface Meal {
  strMeal: string;
  servings: string;
  prepTime: string;
  cookTime: string;
  strCategory: string;
  strArea: string;
  ingredients: Ingredient[];
  strInstructions: string;
  notes: string;
}
