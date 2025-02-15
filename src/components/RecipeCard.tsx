import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Meal } from "@/services/mealdb";
import ShareRecipeButton from "./ShareRecipeButton";

interface RecipeCardProps {
  recipe: Meal;
  userIngredients: string[];
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  userIngredients,
}) => {

  console.log(recipe)
  const missingIngredients = recipe.ingredients.filter((ing) => {
    for (const userIng of userIngredients) {
      if (ing.name.toLowerCase().includes(userIng.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  // included ingredients are the ones that are not missing. included = recipe - missing
  const includedIngredients = recipe.ingredients.filter((ing) => {
    for (const userIng of userIngredients) {
      if (ing.name.toLowerCase().includes(userIng.toLowerCase())) {
        return true;
      }
    }
    return false;
  });

  const youtubeEmbedUrl = recipe.strYoutube?.replace("watch?v=", "embed/");

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="relative p-0">
        {recipe.strMealThumb ? (
          <div className="h-48 overflow-hidden">
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover transition-transform hover:scale-105"
              onError={(e) => {
                // set to invisible if image fails to load
                (e.target as HTMLImageElement).style.visibility = "hidden";
              }}
            />
          </div>
        ) : null}
        <div className="p-4 bg-white/90 backdrop-blur-sm flex justify-between items-center">
          <CardTitle>{recipe.strMeal}</CardTitle>
          <ShareRecipeButton recipe={recipe} />
        </div>
      </CardHeader>
      <CardDescription className="p-4 space-y-4">
        {recipe.strInstructions}
      </CardDescription>
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{recipe.strCategory}</Badge>
          <Badge variant="outline">{recipe.strArea}</Badge>
        </div>

        {includedIngredients.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">
              Included Ingredients:
            </h4>
            <div className="flex gap-2 flex-wrap">
              {includedIngredients.map((ing) => (
                <Badge key={ing.name} variant="default">
                  {ing.name} 
                </Badge>
              ))}
            </div>
          </div>
        )}

        {missingIngredients.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Missing Ingredients:</h4>
            <div className="flex gap-2 flex-wrap">
              {missingIngredients.map((ing) => (
                <Badge key={ing.name} variant="destructive">
                  {ing.name} 
                </Badge>
              ))}
            </div>
          </div>
        )}

        {recipe.strYoutube && (
          <div className="aspect-video mt-4">
            <iframe
              src={youtubeEmbedUrl}
              title={recipe.strMeal}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full rounded-lg"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};