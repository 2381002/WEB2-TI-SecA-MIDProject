import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  body: string;
  views: number;
  reactions: { likes: number };
}

const fetchPostList = async () => {
  try {
    const response = await axios.get<{ posts: Post[] }>("/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [] };
  }
};

const createPost = async (newPost: { title: string; body: string }) => {
  try {
    const response = await axios.post<Post>("/posts", {
      ...newPost,
      views: 0,
      reactions: { likes: 0 },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
  }
};

const SkeletonLoader = () => (
  <div className="bg-gray-200 animate-pulse rounded-lg shadow-md overflow-hidden h-64"></div>
);

const Posts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data, isFetching, error } = useQuery({
    queryKey: ["postList"],
    queryFn: fetchPostList,
  });

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postList"] });
      setModalOpen(false);
      setTitle("");
      setBody("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    mutation.mutate({ title, body });
  };

  if (error) return <p className="text-red-500">Failed to load posts.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all"
      >
        + Add Post
      </button>

      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">📌 Latest Posts</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching
          ? [1, 2, 3].map((key) => <SkeletonLoader key={key} />)
          : data?.posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={`https://source.unsplash.com/random/400x300?sig=${post.id}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {post.body ? post.body.substring(0, 80) + "..." : "No content available"}
                  </p>
                  <div className="flex justify-between items-center mt-3 text-gray-500 text-xs">
                    <p>👀 {post.views} Views</p>
                    <p>❤️ {post.reactions.likes} Likes</p>
                  </div>
                  <button
                    onClick={() => navigate(`/posts/${post.id}`)}
                    className="mt-3 inline-block text-blue-500 hover:underline text-sm cursor-pointer"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setModalOpen(false)} className="bg-gray-400 px-4 py-2 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                  Add Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;