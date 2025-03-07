import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/AxiosInstance";

interface PostDetail {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
}

const fetchPostDetail = async (id: string | undefined) => {
  if (!id) return null;
  try {
    const response = await axios.get<PostDetail>(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return null;
  }
};

const deletePost = async (id: string) => {
  try {
    await axios.delete(`/posts/${id}`);
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isFetching, error } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: () => fetchPostDetail(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: async (postId: string) => await deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      navigate("/posts");
    },
  });

  if (isFetching) return <p className="text-center text-gray-500">Loading...</p>;
  if (!post || error) return <p className="text-red-500 text-center">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-700 mt-2">{post.body}</p>

      {/* Tags */}
      <div className="mt-4">
        <h3 className="font-semibold">Tags:</h3>
        <div className="flex gap-2 mt-1">
          {post.tags.map((tag, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Reactions & Views */}
      <div className="mt-4 flex items-center gap-4 text-gray-600">
        <span>👍 {post.reactions.likes} Likes</span>
        <span>👎 {post.reactions.dislikes} Dislikes</span>
        <span>👀 {post.views} Views</span>
      </div>

      {/* Action Buttons */}
      <div className="fixed bottom-6 right-6 flex space-x-3">
        <button
          onClick={() => navigate(`/posts/edit/${id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 cursor-pointer"
        >
          ✏ Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this post?")) {
              mutation.mutate(id!);
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 cursor-pointer"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
};

export default PostDetail;
