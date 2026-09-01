import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useToast } from "@context/ToastContext";
import { useAuthContext } from "@context/AuthContext";
import { validatePostMediaFiles } from "@lib/postUploadLimits";

const usePosts = () => {
  const { isSkYouth, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const [createPostUpload, setCreatePostUpload] = useState({
    progress: 0,
    hasMedia: false,
  });

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
    mutationFn: async (postPayload) => {
      const isFormData = postPayload instanceof FormData;
      const formData = isFormData ? postPayload : postPayload.formData;
      const onUploadProgress = isFormData
        ? undefined
        : postPayload.onUploadProgress;
      const validationMessage = validatePostMediaFiles(
        formData.getAll("media"),
      );

      if (validationMessage) {
        const validationError = new Error(validationMessage);
        validationError.code = "POST_MEDIA_VALIDATION";
        throw validationError;
      }

      const { data } = await axiosInstance.post("/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? progressEvent.loaded / progressEvent.total
            : progressEvent.progress;

          if (typeof progress === "number") {
            setCreatePostUpload((current) => ({
              ...current,
              progress: Math.min(100, Math.round(progress * 100)),
            }));
          }

          onUploadProgress?.(progressEvent);
        },
      });
      return data.data;
    },
    onMutate: (postPayload) => {
      const formData =
        postPayload instanceof FormData ? postPayload : postPayload.formData;
      setCreatePostUpload({
        progress: 0,
        hasMedia: formData.getAll("media").length > 0,
      });
    },
    onSuccess: (createdPost) => {
      showSuccess("Your post has been published successfully");
      queryClient.setQueryData(["posts"], (currentPosts = []) => [
        createdPost,
        ...currentPosts.filter((post) => post.post_id !== createdPost.post_id),
      ]);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      showError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to publish your post",
      );
    },
    onSettled: () => {
      setCreatePostUpload({ progress: 0, hasMedia: false });
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    viewPosts,
    managePosts,
    postsQuery,
    createPost,
    createPostUpload,
    updatePost,
    deletePost,
  };
};

export default usePosts;
