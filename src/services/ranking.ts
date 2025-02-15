import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyC_P29ZTUqspvSy8nlA7b9XRHNW5hjG-70");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const prompt = "Explain how AI works";

// const result = await model.generateContent(prompt);
// console.log(result.response.text());

function getNameWithHighestScore(scores) {
    if (!scores || Object.keys(scores).length === 0) {
      return null;
    }
  
    let highestScore = -1; // Initialize to -1 (or any value < 0) since scores are 0-100
    let highestScoreName = null;
  
    for (const name in scores) {
      if (scores.hasOwnProperty(name)) {
        const score = scores[name];
  
        if (typeof score !== 'number' || isNaN(score)) { // Check for non-numeric or NaN
          console.warn(`Score for ${name} is not a number. Skipping.`);
          continue;
        }
          if (score < 0 || score > 100) {
              console.warn(`Score for ${name} is out of range. Skipping.`);
              continue;
          }
  
        if (score > highestScore) {
          highestScore = score;
          highestScoreName = name;
        }
      }
    }
  
    return highestScoreName;
  }

export async function rankRecipes(recipes, ingredients){
    let rankingScores = {
    }

    // Get the scores
    for (const recipe of recipes){
        // prompt engineering
        let stringOfRecipe = `${recipe.strMeal} ${recipe.strCategory} ${recipe.strInstructions} ${recipe.strIngredients}`;
        let stringOfIngredients = ""
        // console.log("my ingredients are ,", ingredients, JSON.stringify(ingredients))
        for (const ingredient of ingredients) {
            const each = `${ingredient.name} (Quantity: ${ingredient.quantity})
`
            stringOfIngredients += each
        }

        
        let prompt = `${stringOfRecipe}\n\nhello gemini, the above is a receipe. below is a list of ingredients we have:\n\n${stringOfIngredients}. Please return a score of 1 to 100 of how similar the ingredients matches the recipe. You must only return an integer and only a number. DONT describe why you rank it that way. DONT put the percentage sign with the number.`
        // console.log("our prompt", prompt)
        // continue

        // query a gemini
        const result = await model.generateContent(prompt);
        console.log(recipe.strMeal)
        const score = result.response.text()
        console.log(score);
        rankingScores[recipe.strMeal] = Number(score.trim())
    }
    console.log(rankingScores)
    
    // alert(rankingScores);
    return getNameWithHighestScore(rankingScores);
}