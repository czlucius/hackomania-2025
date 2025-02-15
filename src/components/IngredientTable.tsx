
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Star } from "lucide-react";

export interface Ingredient {
  id: string;
  name: string;
}

interface IngredientTableProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
  mainIngredient : string;
  onMainIngredientChange : any
}

export const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  onIngredientsChange,
  mainIngredient,
  onMainIngredientChange
}) => {
  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, "id">>({
    name: "",
  });

  const setAsMain = (name: string) => {
    onMainIngredientChange(name)
  }

  const addIngredient = () => {
    if (newIngredient.name.trim() === "") return;

    onIngredientsChange([
      ...ingredients,
      { ...newIngredient, id: Math.random().toString(36).slice(2) },
    ]);
    setNewIngredient({ name: "" });
  };

  const removeIngredient = (id: string) => {
    onIngredientsChange(ingredients.filter((ing) => ing.id !== id));
  };

  


  return (
    <div className="w-full rounded-lg overflow-hidden bg-white backdrop-blur-lg border shadow-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ingredient</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
            <TableHead className="w-[100px]">Main Ingredient?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell>{ingredient.name}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ingredient.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => setAsMain(ingredient.name)}
                  className={`inline-flex items-center p-2 rounded-md ${
                    mainIngredient === ingredient.name
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Star className={`w-5 h-5 ${
                          mainIngredient === ingredient.name ? 'fill-yellow-500' : ''
                        }`} />  
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input
                placeholder="Name"
                className ="w-full"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Button onClick={addIngredient} size="icon" variant="ghost">
                <Plus className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
