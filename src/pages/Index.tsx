import React, { useState } from "react";
import { IngredientTable, type Ingredient } from "@/components/IngredientTable";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { searchMealsByIngredient, type Meal } from "@/services/mealdb";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { aiSearchMeals } from "@/services/ai";

const Index = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGen, setAiGen] = useState(false);

  const handleSearch = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    try {
      // Search using the first ingredient for now
      let results;
      if (!aiGen) {
        results = await searchMealsByIngredient(ingredients[0].name);
      } else {
        results = await aiSearchMeals(ingredients);
      }

      setRecipes(results);
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
        <h2 className="text-2xl font-semibold tracking-tight">
          Your Ingredients
        </h2>
        <div className="text-muted-foreground">
          <span className="mx-3">
            {aiGen ? "Generate with AI" : "AI-assisted search"}
          </span>

          <Switch
            checked={aiGen}
            onCheckedChange={(chg) => {
              setAiGen(chg);
            }}
          ></Switch>
        </div>

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
            Available Recipes
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                userIngredients={ingredients.map((i) => i.name.toLowerCase())}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
