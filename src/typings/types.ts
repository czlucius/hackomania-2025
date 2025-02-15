export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface IngredientTableProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  mainIngredient: string;
  onMainIngredientChange: any;
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

interface RecipeCardProps {
  recipe: Meal;
  userIngredients: string[];
}

export interface AIProvider {
  generateRecipe(ingredients: Ingredient[]): Promise<Recipe[]>;
  analyzeImage(imageData: string): Promise<Ingredient[]>;
  rankRecipes(
    recipes: Recipe[],
    availableIngredients: Ingredient[],
  ): Promise<Recipe[]>;
}
