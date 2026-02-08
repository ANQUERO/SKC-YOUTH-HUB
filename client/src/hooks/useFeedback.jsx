import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@lib/axios";
import { AuthContextProvider } from "@context/AuthContext";
import { useToast } from "@context/ToastContext";

const useFeedback = () => {
  const { isSkYouth, isSkSuperAdmin, isSkNaturalAdmin } = AuthContextProvider();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const canManage = isSkSuperAdmin || isSkNaturalAdmin;
  const canView = isSkYouth || canManage;

  // Fetch all feedback forms
  const feedbackFormsQuery = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/feedback");
      return data.data || [];
    },
    enabled: canView,
  });

  // Fetch single feedback form
  const getFeedbackForm = async (formId) => {
    const { data } = await axiosInstance.get(`/feedback/${formId}`);
    return data.data;
  };

  // Create feedback form (officials only)
  const createFeedbackForm = useMutation({
    mutationFn: async (formData) => {
      const { data } = await axiosInstance.post("/feedback", formData);
      return data.data;
    },
    onSuccess: () => {
      showSuccess("Feedback form created successfully");
      queryClient.invalidateQueries(["feedback"]);
    },
    onError: (error) => {
      showError(
        error.response?.data?.message || "Failed to create feedback form",
      );
    },
  });

  // Submit feedback reply (youth only)
  const submitFeedbackReply = useMutation({
    mutationFn: async ({ formId, response }) => {
      const { data } = await axiosInstance.post(`/feedback/${formId}/reply`, {
        response,
      });
      return data.data;
    },
    onSuccess: () => {
      showSuccess("Your feedback has been submitted successfully");
      queryClient.invalidateQueries(["feedback"]);
    },
    onError: (error) => {
      showError(error.response?.data?.message || "Failed to submit feedback");
    },
  });

  return {
    feedbackForms: feedbackFormsQuery.data || [],
    isLoading: feedbackFormsQuery.isLoading,
    canManage,
    canView,
    createFeedbackForm: createFeedbackForm.mutate,
    submitFeedbackReply: submitFeedbackReply.mutate,
    getFeedbackForm,
    isSubmitting: submitFeedbackReply.isPending,
    isCreating: createFeedbackForm.isPending,
  };
};

export default useFeedback;
