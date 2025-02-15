import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AIFeatureProvider } from "./aiimpl";
const app = new Hono();
// CORS
app.use("/api/*", cors());
console.log("API key is", process.env.API_KEY);
const aiProvider = new AIFeatureProvider(process.env.API_KEY ?? "");

app.post("/", (c) => {
  // const a = aiProvider.generateRecipe([]);
  return c.text("Hello Hono!");
});

app.post("/api/gen", async (c) => {
  const body = await c.req.json();
  if (!Array.isArray(body)) {
    return c.json({ error: "Body must be an array" }, 400);
  }
  console.log("Received request", body);

  const ingredients = body;
  const recipes = await aiProvider.generateRecipe(ingredients);
  return c.json(recipes);
});

app.post("/api/rank", async (c) => {
  const body = await c.req.json();
  // if (!Array.isArray(body)) {
  //   return c.json({ error: "Body must be an array" }, 400);
  // }
  console.log("Received request", body);
  const recipes = body.recipes;
  const ingredients = body.ingredients;
  const result = await aiProvider.rankRecipes(recipes, ingredients);
  return c.json(result);
});

export default app;
