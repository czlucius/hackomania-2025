import { Ingredient } from "@/components/IngredientTable";
import { toast } from "@/hooks/use-toast";

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

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

export const searchMealsByIngredient = async (
  ingredient: string,
): Promise<Meal[]> => {
  try {
    const response = await fetch(
      `${MEALDB_BASE_URL}/filter.php?i=${ingredient}`,
    );
    const data = await response.json();

    if (!data.meals) {
      return [];
    }
    // Limit to 20 meals max

    const meals = data.meals.slice(0, 20);

    // Get full details for each meal
    const detailedMeals = await Promise.all(
      meals.map((meal: { idMeal: string }) => {
        return getMealById(meal.idMeal);
      }),
    );

    return detailedMeals.filter(Boolean);
  } catch (error) {
    console.error("Error searching meals:", error);
    toast({
      title: "Error",
      description: "Failed to search for recipes. Please try again.",
      variant: "destructive",
    });
    return [];
  }
};

export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    const response = await fetch(`${MEALDB_BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || !data.meals[0]) {
      return null;
    }

    const meal = data.meals[0];
    const ingredients = [];

    // Extract ingredients and measures
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          quantity: measure ? measure.trim() : "",
        });
      }
    }

    return {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strYoutube: meal.strYoutube,
      ingredients,
    };
  } catch (error) {
    console.error("Error fetching meal details:", error);
    toast({
      title: "Error",
      description: "Failed to fetch recipe details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
};
