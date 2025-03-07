import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";

const fetchRecipeDetail = async (id: string | undefined) => {
  if (!id) return null;
  try {
    const response = await axios.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recipe detail:", error);
    return null;
  }
};

const updateRecipe = async ({ id, updatedData }: { id: string; updatedData: any }) => {
  try {
    const response = await axios.put(`/recipes/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating recipe:", error);
    throw new Error("Failed to update recipe");
  }
};

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: recipe, isFetching } = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id),
  });

  const [formData, setFormData] = useState({
    name: recipe?.name || "",
    description: recipe?.description || "",
    category: recipe?.category || "",
  });

  const mutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: any }) =>
      updateRecipe({ id, updatedData }),
    onSuccess: () => {
      navigate(`/recipes/${id}`); // Redirect ke detail resep setelah update
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id: id as string, updatedData: formData });
  };

  if (isFetching) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        <label className="block mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        <label className="block mb-2">Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 hover:blue rounded cursor-pointer">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
