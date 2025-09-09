import {
    useQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const usePosts = () => {
    const {
        isSkYouth,
        isSkSuperAdmin,
        isSkNaturalAdmin
    } = useAuthContext();
    const queryClient = useQueryClient();

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
        mutationFn: async (newPost) => {
            const { data } = await axiosInstance.post("/post", newPost);
            return data.data;
        },
        onSuccess: () => {
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
