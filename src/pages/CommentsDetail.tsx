import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

interface CommentsDetail {
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

const fetchCommentDetail = async (id: string) => {
  try {
    const response = await axios.get(`/comments/${id}`);
    console.log("Fetched Comment Detail:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment detail:", error);
    throw new Error("Failed to fetch comment detail");
  }
};

const deleteComment = async (id: string) => {
  await axios.delete(`/comments/${id}`);
};

const CommentsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: comment, isLoading, isError } = useQuery({
    queryKey: ["comment", id],
    queryFn: () => fetchCommentDetail(id!),
  });

  const mutation = useMutation({
    mutationFn: () => deleteComment(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      alert("Comment deleted successfully!");
      navigate("/comments");
    },
    onError: () => {
      alert("Failed to delete comment.");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      mutation.mutate();
    }
  };

  if (isLoading) return <p className="text-center text-lg text-gray-500">Loading comment...</p>;
  if (isError || !comment) return <p className="text-center text-lg text-red-500">❌ Error fetching comment.</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Comment Detail</h2>
      <div className="p-6 bg-white shadow-md rounded-md">
        <h3 className="text-lg font-semibold">{comment.user.fullName}</h3>
        <p className="text-sm text-gray-600">@{comment.user.username}</p>
        <p className="mt-4">{comment.body}</p>
        <p className="text-gray-500 text-sm mt-2">👍 {comment.likes} Likes</p>
      </div>
      <div className="mt-4 flex gap-4">
        <Link to="/comments" className="text-blue-500 cursor-pointer">← Back to Comments</Link>
        <Link to={`/comments/edit/${comment.id}`} className="text-green-500 cursor-pointer">✏ Edit Comment</Link>
        <button 
          onClick={handleDelete} 
          className="text-red-500 cursor-pointer"
        >
          🗑 Delete Comment
        </button>
      </div>
    </div>
  );
};

export default CommentsDetail;
