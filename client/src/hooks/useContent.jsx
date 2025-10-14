import React, { useState } from "react";
import axiosInstance from "@lib/axios";
import { useAuthContext } from "@context/AuthContext";

const useContent = () => {
  const { isSkSuperAdmin, isSkNaturalAdmin } = useAuthContext();
  const isAuthorized = isSkSuperAdmin || isSkNaturalAdmin;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const fetchContents = async (content_id) => {
    if (!isAuthorized) {
      setError("Unauthorized access");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await axiosInstance.get(`/contents?content_id=${content_id}`);
      setSuccess("Contents fetched successfully");
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch contents";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async (content_id) => {
    if (!isAuthorized) {
      setError("Unauthorized access");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await axiosInstance.get(`/contents/${content_id}`);
      setSuccess("Content fetched successfully");
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to fetch content";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createContent = async (contentData) => {
    if (!isAuthorized) {
      setError("Unauthorized access");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("official_name", contentData.official_name);
      formData.append("official_title", contentData.official_title);
      formData.append("media_url", contentData.media_url);

      if (contentData.media_file) {
        formData.append("media", contentData.media_file);
      }

      const res = await axiosInstance.post("/contents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess("Content created successfully");
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create content";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateContent = async (content_id, contentData) => {
    if (!isAuthorized) {
      setError("Unauthorized access");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const formData = new FormData();
      if (contentData.official_name) formData.append("official_name", contentData.official_name);
      if (contentData.official_title) formData.append("official_title", contentData.official_title);
      if (contentData.media_type) formData.append("media_type", contentData.media_type);
      if (contentData.media_url) formData.append("media_url", contentData.media_url);

      if (contentData.media_file) {
        formData.append("media", contentData.media_file);
      }

      const res = await axiosInstance.put(`/contents/${content_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setSuccess("Content updated successfully");
      return res.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update content";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteContent = async (content_id) => {
    if (!isAuthorized) {
      setError("Unauthorized access");
      return;
    }

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      await axiosInstance.delete(`/contents/${content_id}`);
      setSuccess("Content deleted successfully");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete content";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setSuccess(null);
    setError(null);
  };

  return {
    loading,
    success,
    error,
    fetchContents,
    fetchContent,
    createContent,
    updateContent,
    deleteContent,
    clearMessages,
    isAuthorized,
  };
};

export default useContent;