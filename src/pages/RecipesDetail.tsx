import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useParams, useNavigate } from "react-router-dom";

interface RecipeDetail {
  id: number;
  name: string;
  description: string;
  category: string;
  ingredients: string[];
  instructions: string[];
  image?: string;
}

const fetchRecipeDetail = async (id: string | undefined) => {
  if (!id) return null;
  try {
    const response = await axios.get<RecipeDetail>(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe detail:", error);
    return null;
  }
};

const deleteRecipe = async (id: number) => {
  try {
    await axios.delete(`/recipes/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return false;
  }
};

const RecipeDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="w-full max-w-lg rounded-lg shadow-lg bg-gray-300 animate-pulse"></div>
      <div className="space-y-4">
        <div className="h-10 bg-gray-300 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
      </div>
    </div>
  </div>
);

const RecipesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isFetching, error } = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id),
  });

  const mutation = useMutation({
    mutationFn: () => deleteRecipe(Number(id)),
    onSuccess: () => {
      navigate("/recipes");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      mutation.mutate();
    }
  };

  if (isFetching) return <RecipeDetailSkeleton />;
  if (!recipe || error) return <p className="text-red-500">Recipe not found.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Floating Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-3">
        {/* Edit Button */}
        <button
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition cursor-pointer"
          onClick={() => navigate(`/recipes/edit/${recipe.id}`)}
        >
          ✎
        </button>

        {/* Delete Button */}
        <button
          className="bg-red-500 text-white rounded-full p-4 shadow-lg hover:bg-red-600 transition cursor-pointer"
          onClick={handleDelete}
        >
          🗑️
        </button>
      </div>

      {/* Recipe Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <img
            src={recipe.image || "/placeholder.jpg"}
            alt={recipe.name}
            className="w-full max-w-lg rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
          <p className="text-gray-600">{recipe.description}</p>
          <p className="text-gray-600">
            <span className="font-bold">Category:</span> {recipe.category}
          </p>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ingredients</h3>
            <ul className="list-disc ml-5 text-gray-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">Instructions</h3>
            <ol className="list-decimal ml-5 text-gray-600">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesDetail;
