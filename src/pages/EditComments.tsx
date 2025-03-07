import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

// Definisikan tipe komentar
interface Comment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  };
}

// Fungsi untuk fetch data komentar berdasarkan ID
const fetchCommentDetail = async (id: string): Promise<Comment> => {
  const response = await axios.get<Comment>(`/comments/${id}`);
  return response.data;
};

const EditComments = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  // Fetch komentar berdasarkan ID
  const { data: comment, isPending, isError } = useQuery<Comment>({
    queryKey: ["comment", id],
    queryFn: () => fetchCommentDetail(id as string),
    enabled: !!id,
  });

  // Perbarui state `body` saat data komentar tersedia
  useEffect(() => {
    if (comment) {
      setBody(comment.body);
    }
  }, [comment]);

  // Mutasi untuk mengupdate komentar
  const mutation = useMutation({
    mutationFn: async (updatedComment: { body: string }) => {
      await axios.put(`/comments/${id}`, updatedComment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey :["comments"] });
      alert("Comment updated successfully!");
      navigate(`/comments/${id}`);
    },
    onError: () => {
      alert("Failed to update comment.");
    },
  });

  // Handle submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ body });
  };

  if (isPending) return <p className="text-center text-lg text-gray-500">Loading comment...</p>;
  if (isError || !comment) return <p className="text-center text-lg text-red-500">❌ Error loading comment.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Comment</h2>
      <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-md">
        <label className="block text-gray-700">Comment Body:</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full border rounded-md p-2 mt-2"
          rows={4}
        ></textarea>
        <div className="mt-4 flex gap-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer">Save Changes</button>
          <button type="button" onClick={() => navigate(-1)} className="bg-gray-500 text-white px-4 py-2 rounded-md cursor-pointer">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditComments;
