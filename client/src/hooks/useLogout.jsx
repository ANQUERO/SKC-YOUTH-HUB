import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@lib/axios.js";
import { AuthContextProvider } from "@context/AuthContext";

export const useLogout = () => {
  const navigate = useNavigate();
  const { setAuthUser } = AuthContextProvider();

  const logout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setAuthUser(null);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [navigate, setAuthUser]);

  return logout;
};
