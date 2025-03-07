import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../utils/AxiosInstance";

interface PostDetail {
  id: number;
  title: string;
  body: string;
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

const updatePost = async ({ id, updatedData }: { id: string; updatedData: Partial<PostDetail> }) => {
  try {
    await axios.put(`/posts/${id}`, updatedData);
  } catch (error) {
    console.error("Error updating post:", error);
  }
};

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: post, isFetching, error } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: () => fetchPostDetail(id),
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: Partial<PostDetail> }) =>
      updatePost({ id, updatedData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["postDetail", id] });
      navigate(`/posts/${id}`);
    },
  });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Update state setelah data berhasil di-fetch
  if (!isFetching && post && title === "" && body === "") {
    setTitle(post.title);
    setBody(post.body);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ id: id!, updatedData: { title, body } });
  };

  if (isFetching) return <p>Loading...</p>;
  if (!post || error) return <p className="text-red-500">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium text-gray-700">Content</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded shadow">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditPost;
