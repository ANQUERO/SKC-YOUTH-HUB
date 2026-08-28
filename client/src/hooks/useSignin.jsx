import { useState } from "react";
import axiosInstance from "@lib/axios.js";
import { useAuthContext } from "@context/AuthContext";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const validateCredentials = ({ email, password }) => {
  const validationErrors = {};

  if (!String(email || "").trim()) {
    validationErrors.email = "A valid email address is required";
  } else if (!emailPattern.test(email)) {
    validationErrors.email = "Please enter a valid email address";
  }

  if (!password) {
    validationErrors.password = "Password is required";
  } else if (password.length < 8) {
    validationErrors.password = "Password must be at least 8 characters";
  } else if (!passwordPattern.test(password)) {
    validationErrors.password =
      "Password must include uppercase, lowercase, number, and special character";
  }

  return validationErrors;
};

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { setAuthUser, setActiveRole } = useAuthContext();

  const validateField = (fieldName, value) => {
    const result = validateCredentials({
      email: fieldName === "email" ? value : "valid@example.com",
      password: fieldName === "password" ? value : "Valid1!x",
    });
    if (result[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: result[fieldName] }));
    } else {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const login = async (email, password) => {
    const validationErrors = validateCredentials({ email, password });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return { success: false, user: null };
    }

    setLoading(true);
    setErrors({});
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      const loggedInUser = {
        ...res.data.user,
        ...(res.data.token ? { token: res.data.token } : {}),
      };

      // Ensure role is always an array
      const roles = Array.isArray(loggedInUser.role)
        ? loggedInUser.role
        : loggedInUser.role
          ? [loggedInUser.role]
          : [];

      localStorage.setItem("auth-user", JSON.stringify(loggedInUser));
      setAuthUser(loggedInUser);

      if (roles.length > 0) {
        setActiveRole(roles[0]);
        localStorage.setItem("active-role", roles[0]);
      }

      return { success: true, user: loggedInUser };
    } catch (err) {
      if ([400, 401, 403].includes(err.response?.status)) {
        const responseData = err.response?.data || {};
        setErrors(responseData.errors || {
          general:
            responseData.error ||
            responseData.message ||
            "Invalid credentials",
        });
      } else {
        setErrors({ general: "Something went wrong. Please try again." });
      }
      return { success: false, user: null };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, errors, validateField };
};

export default useLogin;
