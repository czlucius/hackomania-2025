
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Meal } from "@/services/mealdb";

interface RecipeCardProps {
  recipe: Meal;
  userIngredients: string[];
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, userIngredients }) => {
  const missingIngredients = recipe.ingredients.filter(
    (ing) => !userIngredients.includes(ing.name.toLowerCase())
  );

  const youtubeEmbedUrl = recipe.strYoutube?.replace("watch?v=", "embed/");

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="relative p-0">
        <div className="h-48 overflow-hidden">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardTitle className="p-4 bg-white/90 backdrop-blur-sm">
          {recipe.strMeal}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="secondary">{recipe.strCategory}</Badge>
          <Badge variant="outline">{recipe.strArea}</Badge>
        </div>
        
        {missingIngredients.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Missing Ingredients:</h4>
            <div className="flex gap-2 flex-wrap">
              {missingIngredients.map((ing) => (
                <Badge key={ing.name} variant="destructive">
                  {ing.name} ({ing.measure})
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
