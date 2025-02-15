import React, { useState } from "react";
import { IngredientTable, type Ingredient } from "@/components/IngredientTable";
import { RecipeCard } from "@/components/RecipeCard";
import ShareButton from "@/components/ShareRecipeButton";
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
import JSConfetti from 'js-confetti'
const jsConfetti = new JSConfetti()

import grassImage from "../grass.jpg";
import { Input } from "@/components/ui/input";
import DoughnutChart from "@/components/NutritionChart"

const myData = {
  Protein: 35,
  Carbs: 60,
  Fats: 20,
  Fiber: 5,
  Sugar: 10
};

const Index = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [mainIngredient, setMainIngredient] = useState("");
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiGen, setAiGen] = useState(false);
  const [ranking, setRanking] = useState<string>("");
  const [nutrition, setNutrition] = useState<Object>({});

  const [file, setFile] = useState<File | null>(null);
  const [showModal, setShowModal] = useState(false);

  async function getNutritionData(foodName) {  // Accept foodName as an argument
    try {
      const response = await fetch('http://localhost:3000/api/nutrition', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json', // Important: Tell the server you're sending JSON
        },
        body: JSON.stringify({ name: foodName }), // Send the food name in the request body
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Try to get error details from the server
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || response.statusText}`); // Include error message
      }
  
      const text = await response.text();
  
      const cleanText = text.trim().replace(/```json\n/g, '').replace(/```/g, '');
      const nutritionObject = JSON.parse(cleanText);
      console.log(nutritionObject)
      setNutrition(nutritionObject);
  
      return nutritionObject;
  
    } catch (error) {
      console.error("Error fetching or parsing nutrition data:", error);
      return null;
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const [imageUploading, setImageUploading] = useState(false);

  const handleUpload = async (event) => {
    if (!file) return;
    setImageUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3000/api/analyzeImage", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setShowModal(false);
      setImageUploading(false);

      const newIngredients = result.name;
      const ingredientsObjs = newIngredients.map((name: string) => ({
        name,
        id: Math.random().toString(36).slice(2),
      }));
      setIngredients([...ingredients, ...ingredientsObjs]);
    } catch (error) {
      alert("Error uploading image");
    }
  };

  const UploadModal = (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
        </DialogHeader>
        <input
          type="file"
          accept="image/jpeg"
          onChange={handleFileSelect}
          className="mb-4"
        />
        <DialogFooter>
          <Button disabled={imageUploading} onClick={handleUpload}>
            {imageUploading ? "Loading..." : "Upload"}
          </Button>
          <Button variant="outline" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
  const [cookingStyle, setCookingStyle] = useState("");
  const [isHealthy, setIsHealthy] = useState(false);
  const [seasonings, setSeasonings] = useState("");
  const [diet, setDiet] = useState("");

  const handleSearch = async () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);
    try {
      // Search using the first ingredient for now

      let results: Meal[];
      if (!aiGen) {
        results = await searchMealsByIngredient(
          mainIngredient ?? ingredients[0].name,
        );

        setRanking(await newRankRecipes(recipes, ingredients));

        if (ranking != ""){
          jsConfetti.addConfetti();
          getNutritionData(ranking);
        }
      } else {
        let modPrompt = "";
        if (cookingStyle) {
          modPrompt += `Use ${cookingStyle} cooking style. `;
        }
        if (isHealthy) {
          modPrompt += `Make this recipe more healthy. `;
        }
        if (seasonings) {
          modPrompt += `Use these seasonings: ${seasonings}. `;
        }
        if (diet) {
          modPrompt += `Make this recipe ${diet}. `;
        }
        results = await aiSearchMeals(ingredients, modPrompt);
        setRanking(results[0].strMeal);
        jsConfetti.addConfetti();
        getNutritionData(ranking);
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
    for (const recipe of recipes) {
      if (recipe.strMeal == ranking) {
        return (
          <RecipeCard
            key={recipe.idMeal}
            recipe={recipe}
            userIngredients={ingredients.map((i) => i.name.toLowerCase())}
          />
        );
      }
    }
  };
  console.log("my recipes", recipes);
  console.log(JSON.parse(nutrition.replace("json","")))

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
      {UploadModal}
      <Button
        className="bg-blue-600 hover:bg-blue-800"
        onClick={() => {
          setShowModal(true);
        }}
      >
        📸 Upload a image
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
        {aiGen ? (
          <>
            {/* Let the user have option to choose cooking style (text), more healthy (checkbox), seasonings, diet e.g. vegan, halal, hosher (dropdown) */}

            <div className="grid gap-4">
              <div>
                <Input
                  placeholder="Cooking Style (e.g. Asian, Italian, etc)"
                  value={cookingStyle}
                  onChange={(e) => setCookingStyle(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isHealthy}
                  onChange={(e) => setIsHealthy(e.target.checked)}
                  className="h-4 w-4"
                />
                <span>More Healthy</span>
              </div>

              <div>
                <Input
                  placeholder="Seasonings (e.g. herbs, spices)"
                  value={seasonings}
                  onChange={(e) => setSeasonings(e.target.value)}
                />
              </div>

              <div>
                <select
                  value={diet}
                  onChange={(e) => setDiet(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Diet Restriction</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="halal">Halal</option>
                  <option value="kosher">Kosher</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="dairy-free">Dairy-Free</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="low-carb">Low Carb</option>
                  <option value="nut-free">Nut-Free</option>
                  <option value="shellfish-free">Shellfish-Free</option>
                  <option value="pescatarian">Pescatarian</option>
                </select>
              </div>
            </div>
          </>
        ) : null}

        <Button
          onClick={handleSearch}
          disabled={ingredients.length === 0 || isLoading}
          className="w-full"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          🧑‍🍳 Find Recipes
        </Button>
      </div>

      {/* generate AI */}
      {recipes.length > 0 && ranking != "" && ranking != null && (
        // <div className="space-y-4">
        //   <h2 className="text-2xl font-semibold tracking-tight">
        //     Best Recommended Recipe
        //   </h2>

        //   <div className="grid gap-6 sm:grid-cols-2">
        //     {recipes.map((recipe) =>
        //       recipe.strMeal === ranking || aiGen ? (
        //         <RecipeCard
        //           key={recipe.idMeal}
        //           recipe={recipe}
        //           userIngredients={ingredients.map((i) => i.name.toLowerCase())}
        //         />
        //       ) : null,
        //     )}
        //   </div>
        // </div>
        <></>
      )}

      {/* nutrition stats */}
      {recipes.length > 0 && ranking != "" && ranking != null && (
        <div className="grid lg:grid-cols-3 gap-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Nutrition Information
            </h2>
            <p>Calculated in grams (g)</p>

            <div className="grid gap-6 sm:grid-cols-2">
              <DoughnutChart data={JSON.parse(nutrition.replace("json",""))} />
            </div>
          </div>

          <div className="space-y-4 col-span-2 mb-8">
          <h2 className="text-2xl font-semibold tracking-tight">
            Best Recommended Recipe
          </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {recipes.map((recipe) =>
                recipe.strMeal === ranking || aiGen ? (
                  <RecipeCard
                    key={recipe.idMeal}
                    recipe={recipe}
                    userIngredients={ingredients.map((i) => i.name.toLowerCase())}
                  />
                ) : null,
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
