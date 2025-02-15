export interface Ingredient {
  id: string;
  name: string;
  quantity?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  instructions: string[];
  youtubeUrl?: string;
  imageUrl?: string;
  extraIngredients?: Ingredient[];
  matchScore?: number;
}

export interface AIProvider {
  generateRecipe(ingredients: Ingredient[]): Promise<Recipe[]>;
  analyzeImage(imageData: string): Promise<Ingredient[]>;
  rankRecipes(
    recipes: Recipe[],
    availableIngredients: Ingredient[],
  ): Promise<Recipe[]>;
}
