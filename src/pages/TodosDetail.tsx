import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useState } from "react";

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

// Delete Todo
const deleteTodo = async (id: string) => {
  await axios.delete(`/todos/${id}`);
};

const DetailTodos = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: todo, isLoading, error } = useQuery({
    queryKey: ["todo", id],
    queryFn: () => fetchTodoById(id!),
  });

  const mutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      navigate("/todos"); // ✅ Kembali ke halaman daftar todos setelah delete
    },
  });

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    mutation.mutate(id!);
    setShowConfirm(false);
  };

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error loading todo.</p>;

  return (
    <div className="container mx-auto px-6 py-8 flex justify-center">
      <div className="max-w-lg bg-white shadow-lg rounded-lg p-6 w-full">
        {/* Judul Halaman */}
        <h2 className="text-3xl font-bold text-blue-600 mb-4 flex items-center gap-2">
          📌 Todo Detail
        </h2>

        {/* Status Todo */}
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">Status:</p>
          <span
            className={`px-3 py-1 text-sm rounded-full font-semibold ${
              todo?.completed ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {todo?.completed ? "✅ Completed" : "⏳ In Progress"}
          </span>
        </div>

        {/* Isi Todo */}
        <p
          className={`mt-4 text-xl font-medium ${
            todo?.completed ? "line-through text-gray-500" : "text-gray-800"
          }`}
        >
          {todo?.todo}
        </p>

        {/* Tombol Aksi */}
        <div className="mt-6 flex gap-3">
          <Link
            to={`/todos/edit/${id}`}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all shadow"
          >
            ✏ Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all shadow"
          >
            ❌ Delete
          </button>
        </div>
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-semibold mb-4">Yakin ingin menghapus todo ini?</h3>
            <p className="text-gray-600 text-sm">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
              >
                Ya, Hapus
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500 transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailTodos;
