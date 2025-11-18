import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useFeedback = () => {
  const { isSkYouth, isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const queryClient = useQueryClient();

  const managePosts = isSkSuperAdmin || isSkNaturalAdmin;
  const viewPosts = isSkYouth || managePosts;

  {/** Fetch feedbacks */}
  const postsQuery = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/feedback");
      return data.data;
    },
    enabled: viewPosts,
  });

  {/** Create feedback */}
  const createFeedback = useMutation({
    mutationFn: async (new) => {
        
    }
  })


  {/** Fetch feedback */}









};
