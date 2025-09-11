import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useNotifications } from "@context/NotificationContext";
import { useAuthContext } from "@context/AuthContext";

const usePosts = () => {
    const {
        isSkYouth,
        isSkSuperAdmin,
        isSkNaturalAdmin
    } = useAuthContext();
    const queryClient = useQueryClient();
    const { pushNotification } = useNotifications();

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
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.data;
        },
        onSuccess: (data) => {
            pushNotification({
                type: 'post',
                title: 'Post created',
                message: data?.title || 'Your post has been published.',
                meta: { post_id: data?.post_id }
            });
            queryClient.invalidateQueries(["posts"]);
        },
    });

    // --- Update post ---
    const updatePost = useMutation({
        mutationFn: async ({ id, updatedPost }) => {
            const { data } = await axiosInstance.put(`/post/${id}`, updatedPost);
            return data.data;
        },
        onSuccess: (data) => {
            pushNotification({
                type: 'post',
                title: 'Post updated',
                message: data?.title || 'Your post has been updated.',
                meta: { post_id: data?.post_id }
            });
            queryClient.invalidateQueries(["posts"]);
        },
    });

    // --- Delete post ---
    const deletePost = useMutation({
        mutationFn: async (id) => {
            const { data } = await axiosInstance.delete(`/post/${id}`);
            return data.data;
        },
        onSuccess: (data) => {
            pushNotification({
                type: 'post',
                title: 'Post deleted',
                message: 'Your post has been deleted.',
                meta: { post_id: data?.post_id }
            });
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
