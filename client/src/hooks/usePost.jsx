import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useToast } from "@context/ToastContext";
import { useAuthContext } from "@context/AuthContext"; // FIXED IMPORT

const usePosts = () => {
  const {
    isSkYouth,
    isSkSuperAdmin,
    isSkNaturalAdmin,
    loading: authLoading,
  } = useAuthContext(); // FIXED: use hook instead of calling component
  const queryClient = useQueryClient();
  const { showSuccess } = useToast();

  const managePosts = isSkSuperAdmin || isSkNaturalAdmin;
  const viewPosts = isSkYouth || managePosts;

  // --- Fetch posts ---
  const postsQuery = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/post");
      return data.data;
    },
    enabled: viewPosts,
  });

  // --- Create post ---
  const createPost = useMutation({
    mutationFn: async (newPostFormData) => {
      const { data } = await axiosInstance.post("/post", newPostFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.data;
    },
    onSuccess: () => {
      showSuccess("Your post has been published successfully");
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // --- Update post ---
  const updatePost = useMutation({
    mutationFn: async ({ id, updatedPost }) => {
      const { data } = await axiosInstance.put(`/post/${id}`, updatedPost);
      return data.data;
    },
    onSuccess: () => {
      showSuccess("Your post has been updated successfully");
      queryClient.invalidateQueries(["posts"]);
    },
  });

  // --- Delete post ---
  const deletePost = useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/post/${id}`);
      return data.data;
    },
    onSuccess: () => {
      showSuccess("Your post has been deleted successfully");
      queryClient.invalidateQueries(["posts"]);
    },
  });

  return {
    viewPosts,
    managePosts,
    postsQuery,
    createPost,
    updatePost,
    deletePost,
  };
};

export default usePosts;
