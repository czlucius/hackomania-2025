
import React, { useState } from "react";
import { IngredientTable, type Ingredient } from "@/components/IngredientTable";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { searchMealsByIngredient, type Meal } from "@/services/mealdb";
import { rankRecipes } from "@/services/ranking";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ranking, setRanking] = useState(String);

  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    
    setIsLoading(true);
    try {
      // Search using the first ingredient for now
      const results = await searchMealsByIngredient(ingredients[0].name);
      setRecipes(results);
      const results2 = await  rankRecipes(recipes, ingredients)
      alert(results2)
      setRanking(results2);
      
    } catch (error) {
      console.error("Error searching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Recipe Generator</h1>
        <p className="text-muted-foreground">
          Enter your ingredients and discover delicious recipes you can make.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Your Ingredients</h2>
        <IngredientTable
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
        />
        <Button
          onClick={handleSearch}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Find Recipes
        </Button>
      </div>

      {recipes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Best Recommended Recipe
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {recipes.map((recipe) => (
              recipe.strMeal == ranking ? <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                userIngredients={ingredients.map((i) => i.name.toLowerCase())}
              />
              : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
