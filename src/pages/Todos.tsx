import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axios from "../utils/AxiosInstance";

// Interface Todo
interface Todo {
  id: number;
  todo: string;
  completed: boolean;
}

// Fetch Todos
const fetchTodos = async () => {
  try {
    const response = await axios.get<{ todos: Todo[] }>("/todos");
    return response.data.todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
    return [];
  }
};

// Tambah Todo
const createTodo = async (newTodo: { todo: string }) => {
  const response = await axios.post<Todo>("/todos", {
    ...newTodo,
    completed: false,
  });
  return response.data;
};

const Todos = () => {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: todos, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodo("");
      setErrorMessage(""); // Reset error message
    },
  });

  const handleAddTodo = () => {
    if (newTodo.trim() === "") {
      setErrorMessage("Todo tidak boleh kosong!");
      return;
    }
    mutation.mutate({ todo: newTodo });
  };

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-6">📋 Daftar Todos</h2>

      {/* Tambah Todo */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Tambahkan todo..."
            className="border p-3 w-full rounded-lg shadow-sm focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handleAddTodo}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md disabled:bg-gray-400 cursor-pointer"
            disabled={mutation.isPending}
          >
            + Tambah
          </button>
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      </div>

      {/* List Todos */}
      <ul className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, index) => (
            <li
              key={index}
              className="bg-gray-200 animate-pulse p-4 rounded-lg flex justify-between items-center border border-gray-300"
            >
              <span className="w-3/4 h-5 bg-gray-300 rounded"></span>
              <span className="w-1/4 h-5 bg-gray-300 rounded"></span>
            </li>
          ))
        ) : error ? (
          <p className="text-center text-red-500">Error loading todos.</p>
        ) : todos?.length === 0 ? (
          <p className="text-gray-500 text-center">Tidak ada todo. Mulai tambahkan sekarang!</p>
        ) : (
          todos?.map((todo) => (
            <li
              key={todo.id}
              className="bg-white p-4 shadow-lg rounded-lg flex justify-between items-center border border-gray-200 hover:shadow-xl transition-all"
            >
              <span className={todo.completed ? "line-through text-gray-500" : "text-gray-800 text-lg"}>
                {todo.todo}
              </span>
              <Link
                to={`/todos/${todo.id}`}
                className="text-blue-500 hover:underline hover:text-blue-700 transition-all"
              >
                Detail →
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Todos;
