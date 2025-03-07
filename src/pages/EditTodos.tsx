import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";

// Interface Todo
interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

// Fetch Todo by ID
const fetchTodoById = async (id: string) => {
  const response = await axios.get<Todo>(`/todos/${id}`);
  return response.data;
};

// Update Todo
const updateTodo = async ({ id, updatedTodo }: { id: string; updatedTodo: Partial<Todo> }) => {
  const response = await axios.put<Todo>(`/todos/${id}`, updatedTodo);
  return response.data;
};

const EditTodos = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [todoText, setTodoText] = useState("");
  const [completed, setCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodoById(id!),
  });

  useEffect(() => {
    if (todo) {
      setTodoText(todo.todo);
      setCompleted(todo.completed);
    }
  }, [todo]);

  const mutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate(`/todos/${id}`); // ✅ Kembali ke halaman detail setelah edit berhasil
    },
    onError: (err) => {
      setErrorMessage("Gagal menyimpan perubahan. Coba lagi nanti.");
      setIsSaving(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(""); // Reset error sebelum mengirim request
    mutation.mutate({ id: id!, updatedTodo: { todo: todoText, completed } });
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading todo.</p>;

  return (
    <div className="container mx-auto px-6 py-8 flex justify-center">
      <div className="max-w-lg bg-white shadow-lg rounded-lg p-6 w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
          ✏ Edit Todo
        </h2>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            {errorMessage}
          </div>
        )}

        {/* Form Edit */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Todo:</label>
            <input
              type="text"
              value={todoText}
              onChange={(e) => setTodoText(e.target.value)}
              required
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Checkbox Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => setCompleted(!completed)}
              className="h-5 w-5 text-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label className="text-gray-700 font-medium">Selesai</label>
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate(`/todos/${id}`)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              ⬅ Kembali
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isSaving ? "Menyimpan..." : "💾 Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTodos;
