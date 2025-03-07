import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "../utils/AxiosInstance";

const fetchComments = async () => {
  try {
    const response = await axios.get("/comments");
    return Array.isArray(response.data?.comments) ? response.data.comments : [];
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
};

const addComment = async (newComment: { fullName: string; username: string; body: string }) => {
  const response = await axios.post("/comments", newComment);
  return response.data;
};

const SkeletonLoader = () => (
  <div className="p-4 bg-gray-200 animate-pulse rounded-md">
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-full"></div>
  </div>
);

const Comments = () => {
  const queryClient = useQueryClient();
  const { data: comments, isLoading, isError } = useQuery({
    queryKey: ["comments"],
    queryFn: fetchComments,
  });

  const mutation = useMutation({
    mutationFn: addComment,
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey: ["comments"] });
      
      const previousComments = queryClient.getQueryData(["comments"]);

      queryClient.setQueryData(["comments"], (old: any) => [
        { id: Date.now(), user: newComment, body: newComment.body },
        ...(old || []),
      ]);

      return { previousComments };
    },
    onError: (_err, _newComment, context) => {
      queryClient.setQueryData(["comments"], context?.previousComments);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !username || !body) return;

    mutation.mutate({ fullName, username, body });
    setFullName("");
    setUsername("");
    setBody("");
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Comments</h2>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (isError) {
    return <p className="text-center text-lg text-red-500">❌ Error fetching comments.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 shadow-md rounded-md">
        <h3 className="text-lg font-semibold mb-2">Add a Comment</h3>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded-md mb-2"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded-md mb-2"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <textarea
          placeholder="Write your comment..."
          className="w-full p-2 border rounded-md mb-2"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Comment"}
        </button>
      </form>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment: { id: number; user: { fullName: string; username: string }; body: string }) => (
            <div key={comment.id} className="p-4 bg-white shadow-md rounded-md">
              <h3 className="text-lg font-semibold">{comment.user?.fullName ?? "Anonymous"}</h3>
              <p className="text-sm text-gray-600">@{comment.user?.username ?? "unknown"}</p>
              <p className="mt-2">{comment.body}</p>
              <Link to={`/comments/${comment.id}`} className="text-blue-500 mt-2 block">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default Comments;
