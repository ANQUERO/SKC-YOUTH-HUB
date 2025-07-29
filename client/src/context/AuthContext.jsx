import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";

const AuthContext = createContext(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }
    return context;
};

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
    try {
        const stored = localStorage.getItem("active-role");
        if (stored) return stored;
    } catch (error) {
        console.error("Error loading active role:", error);
        localStorage.removeItem("active-role");
    }

    if (!user) return null;
    if (user.userType === "youth") return "youth";
    return user?.role?.[0] ?? null;
};

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(loadInitialAuthUser);
    const [activeRole, setActiveRoleState] = useState(() => getInitialActiveRole(authUser));
    const [loading, setLoading] = useState(true);

    const defaultRole = useMemo(() => {
        if (!authUser) return null;
        if (authUser.userType === "youth") return "youth";
        return authUser?.role?.[0] ?? null;
    }, [authUser]);

    useEffect(() => {
        if (!authUser) {
            setActiveRoleState(null);
            localStorage.removeItem("active-role");
            return;
        }

        const validRoles = authUser.userType === "youth" ? ["youth"] : authUser.role;

        if (!validRoles.includes(activeRole)) {
            const newRole = defaultRole;
            setActiveRoleState(newRole);
            localStorage.setItem("active-role", newRole);
        }

        setLoading(false);
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
        setAuthUser(user);
        if (user) {
            localStorage.setItem("auth-user", JSON.stringify(user));
        } else {
            localStorage.removeItem("auth-user");
            localStorage.removeItem("active-role");
            setActiveRoleState(null);
        }
    };

    const setActiveRole = (role) => {
        setActiveRoleState(role);
        localStorage.setItem("active-role", role);
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                setAuthUser: updateAuthUser,
                activeRole,
                setActiveRole,
                loading,
                isSkYouth: activeRole === "youth",
                isSkAdmin: activeRole === "admin",
                isSkSuperAdmin: activeRole === "super_sk_admin",
                isSkNaturalAdmin: activeRole === "natural_sk_admin"
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
