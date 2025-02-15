import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { AIFeatureProvider } from "./aiimpl";
// import FileReader
const app = new Hono();
// CORS
app.use("/api/*", cors());
console.log("API key is", process.env.OPENAI_API_KEY);
const aiProvider = new AIFeatureProvider(process.env.OPENAI_API_KEY ?? "");

app.post("/", (c) => {
  // const a = aiProvider.generateRecipe([]);
  return c.text("Hello Hono!");
});

app.post("/api/analyzeImage", async (c) => {
  const body = await c.req.parseBody();
  console.log(body["file"]); // File | string

  const data: File = body["file"] as File;

  const bytes = await data.bytes();

  const base64 = Buffer.from(bytes).toString("base64");
  const urlSafeBase64 = base64.replace(/\+/g, "-").replace(/\//g, "_");
  // console.log(base64);
  const base64DataUrl = `data:image/jpeg;base64,${urlSafeBase64}`;

  const analysis = await aiProvider.analyzeImage(base64);

  return c.json(analysis);
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
