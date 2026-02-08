import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// Create the context
const AuthContext = createContext(undefined);

// Custom hook for using the context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
};

// Helper functions
const loadInitialAuthUser = () => {
  try {
    const stored = localStorage.getItem("auth-user");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error loading auth user:", error);
    localStorage.removeItem("auth-user");
    return null;
  }
};

const getInitialActiveRole = (user) => {
  if (!user) return null;

  try {
    const stored = localStorage.getItem("active-role");
    if (stored) {
      // Validate stored role against user's available roles
      if (user.userType === "youth" && stored === "youth") {
        return stored;
      } else if (user.role && user.role.includes(stored)) {
        return stored;
      }
    }
  } catch (error) {
    console.error("Error loading active role:", error);
    localStorage.removeItem("active-role");
  }

  // Default role selection
  if (user.userType === "youth") return "youth";
  return user.role?.[0] ?? null;
};

// Main provider component
export const AuthContextProvider = ({ children }) => {
  // ADD export here
  const [authUser, setAuthUser] = useState(() => loadInitialAuthUser());
  const [activeRole, setActiveRoleState] = useState(() => {
    const user = loadInitialAuthUser();
    return getInitialActiveRole(user);
  });
  const [loading, setLoading] = useState(true);

  const defaultRole = useMemo(() => {
    if (!authUser) return null;
    if (authUser.userType === "youth") return "youth";
    return authUser?.role?.[0] ?? null;
  }, [authUser]);

  // Single useEffect for auth initialization
  useEffect(() => {
    // If no auth user, stop loading immediately
    if (!authUser) {
      setLoading(false);
      return;
    }

    // Get valid roles based on user type
    const validRoles =
      authUser.userType === "youth" ? ["youth"] : authUser.role || [];

    // If no active role or invalid active role, set default
    if (!activeRole || !validRoles.includes(activeRole)) {
      const newRole = defaultRole;
      if (newRole) {
        setActiveRoleState(newRole);
        localStorage.setItem("active-role", newRole);
      }
    }

    // Set loading to false with a small delay to ensure state is settled
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [authUser, activeRole, defaultRole]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "auth-user") {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setAuthUser(newUser);
      }

      if (e.key === "active-role") {
        setActiveRoleState(e.newValue ?? null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Update functions
  const updateAuthUser = (user) => {
    // Ensure user has the expected structure
    const processedUser = user
      ? {
          ...user,
          // Ensure userType is set (handle both userType and user_type)
          userType: user.userType || user.user_type,
          // Ensure IDs are set correctly
          youth_id:
            user.youth_id || (user.userType === "youth" ? user.id : null),
          official_id:
            user.official_id || (user.userType === "official" ? user.id : null),
          // Ensure role is always an array
          role: Array.isArray(user.role)
            ? user.role
            : user.role
              ? [user.role]
              : [],
        }
      : null;

    setAuthUser(processedUser);

    if (processedUser) {
      localStorage.setItem("auth-user", JSON.stringify(processedUser));

      // Auto-set active role
      if (processedUser.userType === "youth") {
        setActiveRoleState("youth");
        localStorage.setItem("active-role", "youth");
      } else if (processedUser.role && processedUser.role.length > 0) {
        setActiveRoleState(processedUser.role[0]);
        localStorage.setItem("active-role", processedUser.role[0]);
      }
    } else {
      localStorage.removeItem("auth-user");
      localStorage.removeItem("active-role");
      setActiveRoleState(null);
    }

    setLoading(false);
  };

  const setActiveRole = (role) => {
    setActiveRoleState(role);
    localStorage.setItem("active-role", role);
  };

  // Debug logging (remove in production)
  useEffect(() => {
    console.log("AuthContext State:", {
      authUser,
      activeRole,
      loading,
      hasUser: !!authUser,
      userType: authUser?.userType,
      roles: authUser?.role,
    });
  }, [authUser, activeRole, loading]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser: updateAuthUser,
        activeRole,
        setActiveRole,
        loading,
        isSkYouth: activeRole === "youth",
        isSkSuperAdmin: activeRole === "super_official",
        isSkNaturalAdmin: activeRole === "natural_official",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
