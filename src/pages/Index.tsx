import React, { useState } from "react";
import { IngredientTable, type Ingredient } from "@/components/IngredientTable";
import { RecipeCard } from "@/components/RecipeCard";
import ShareButton from "@/components/ShareRecipeButton"
import { Button } from "@/components/ui/button";
import { searchMealsByIngredient, type Meal } from "@/services/mealdb";
import { newRankRecipes } from "@/services/ranking";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { aiSearchMeals } from "@/services/ai";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Dictaphone from "@/components/Speech.tsx"

import grassImage from "../grass.jpg";

const Index = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [mainIngredient, setMainIngredient] = useState("");
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGen, setAiGen] = useState(false);
  const [ranking, setRanking] = useState<string>("");


  const handleSearch = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    try {
      // Search using the first ingredient for now

      let results : Meal[];
      if (!aiGen) { 
        results = await searchMealsByIngredient(mainIngredient ?? ingredients[0].name);
        setRanking(await newRankRecipes(recipes, ingredients));
      } else {
        results = await aiSearchMeals(ingredients);
        setRanking(results[0].strMeal);
      }

      setRecipes(results);
    } catch (error) {
      console.error("Error searching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const getRankedRecipes = (recipes: Meal[]) => {
    // load the ranked recipe
    for (const recipe of recipes){
      if (recipe.strMeal == ranking){
        return (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            userIngredients={ingredients.map((i) => i.name.toLowerCase())}
          />
        )
      }
    }
  }
  

  return (
    <div className="container max-w-5xl py-8 space-y-8">
      <div className="space-y-2">
        <div className="mb-8 w-full rounded h-32 overflow-hidden">
          <img className="w-full" src={grassImage}></img>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Recipe Generator</h1>
        <p className="text-muted-foreground">
          Enter your ingredients and discover delicious recipes you can make.
        </p>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-800">
        Upload a image
      </Button>
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

        <Dictaphone></Dictaphone>

        <IngredientTable
          ingredients={ingredients}
          onIngredientsChange={setIngredients}
          mainIngredient={mainIngredient}
          onMainIngredientChange={setMainIngredient}
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

      {/* generate AI */}
      {recipes.length > 0 && !aiGen && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Best Recommended Recipe
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {recipes.map((recipe) =>
              recipe.strMeal == ranking ? (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  userIngredients={ingredients.map((i) => i.name.toLowerCase())}
                />
              ) : null,
            )}
          </div>
        </div>
      )}

      {/* search AI */}
      {aiGen && ranking != "" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Best Recommended Recipe
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {recipes.map((recipe) =>
              recipe.strMeal == ranking ? (
                <RecipeCard
                  key={recipe.idMeal}
                  recipe={recipe}
                  userIngredients={ingredients.map((i) => i.name.toLowerCase())}
                />
              ) : null,
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
