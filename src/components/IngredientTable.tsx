
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
import { Plus, Trash2 } from "lucide-react";

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
}

interface IngredientTableProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  onIngredientsChange,
}) => {
  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, "id">>({
    name: "",
    quantity: "",
  });

  const addIngredient = () => {
    if (newIngredient.name.trim() === "") return;

    onIngredientsChange([
      ...ingredients,
      { ...newIngredient, id: Math.random().toString(36).slice(2) },
    ]);
    setNewIngredient({ name: "", quantity: "" });
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
            <TableHead>Quantity</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ingredients.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell>{ingredient.name}</TableCell>
              <TableCell>{ingredient.quantity}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeIngredient(ingredient.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <Input
                placeholder="Name"
                value={newIngredient.name}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, name: e.target.value })
                }
              />
            </TableCell>
            <TableCell>
              <Input
                placeholder="Quantity"
                value={newIngredient.quantity}
                onChange={(e) =>
                  setNewIngredient({ ...newIngredient, quantity: e.target.value })
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
