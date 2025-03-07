import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

interface Recipe {
  id: number;
  name: string;
  cuisine: string;
  difficulty: string;
  image?: string;
}

interface RecipeData {
  recipes: Recipe[];
}

const fetchRecipeList = async () => {
  try {
    const response = await axios.get<RecipeData>("/recipes");
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return { recipes: [] };
  }
};

const addRecipe = async (newRecipe: { name: string; cuisine: string; difficulty: string; image?: string }) => {
  try {
    const response = await axios.post<Recipe>("/recipes", newRecipe);
    return response.data;
  } catch (error) {
    console.error("Error adding recipe:", error);
  }
};

const RecipeSkeleton = () => (
  <div className="group relative">
    <div className="aspect-square w-full rounded-md bg-gray-200 animate-pulse lg:aspect-auto lg:h-80"></div>
    <div className="mt-4 flex justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="mt-1 h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
      </div>
    </div>
  </div>
);

const Recipes = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [image, setImage] = useState("");

  const { data, isFetching, error } = useQuery({
    queryKey: ["recipeList"],
    queryFn: fetchRecipeList,
  });

  const mutation = useMutation({
    mutationFn: addRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipeList"] });
      setModalOpen(false);
      setName("");
      setCuisine("");
      setDifficulty("");
      setImage("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cuisine || !difficulty) return;
    mutation.mutate({ name, cuisine, difficulty, image: image || "/placeholder.jpg" });
  };

  if (error) {
    return <p className="text-red-500">Failed to load recipes.</p>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">List of Recipes</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all cursor-pointer"
            >
              + Add Recipe
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {isFetching
              ? Array.from({ length: 4 }).map((_, index) => <RecipeSkeleton key={index} />)
              : data?.recipes.map((recipe) => (
                  <div key={recipe.id} className="group relative" onClick={() => navigate(`/recipes/${recipe.id}`)}>
                    <img
                      alt={recipe.name}
                      src={recipe.image || "/placeholder.jpg"}
                      className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                    />
                    <div className="mt-4">
                      <h3 className="text-sm font-semibold text-gray-900">{recipe.name}</h3>
                      <p className="text-sm text-gray-500">{recipe.cuisine} | {recipe.difficulty}</p>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </div>

      {/* Modal untuk Tambah Resep */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Add New Recipe</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Recipe Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Cuisine</label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={(e) => setCuisine(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">Image URL (Optional)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter image URL"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add Recipe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;
