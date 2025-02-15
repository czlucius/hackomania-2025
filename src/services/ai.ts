import { Ingredient } from "@/components/IngredientTable";
/*
export interface Meal {
  idMeal: "1";
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  ingredients: { name: string; measure: string }[];
}
*/
export async function aiSearchMeals(ingredients: Ingredient[]) {
  const results = await (
    await fetch("http://localhost:3000/api/gen", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ingredients),
    })
  ).json();
  console.log(results);
  return [results];
}
