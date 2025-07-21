import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react'

const AuthContext = createContext(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContextProvider');
    };

    return context;
};

const loadInitialAuthUser = () => {
    try {
        const sessionUser = sessionStorage.getItem("auth-user");
        const localUser = localStorage.getItem("auth-user");

        return sessionStorage
            ? JSON.parse(sessionUser)
            : localUser
                ? JSON.parse(localUser)
                : null;
    } catch (error) {
        console.error('Error loading auth user:', error);
        sessionStorage.removeItem("auth-user");
        localStorage.removeItem("auth-user");
        return null;
    }
};

const getInitialActiveRole = (user) => {
    try {
        const stored = localStorage.getItem("active-role");
        if (stored) return stored;
    } catch (error) {
        console.error('Error loading active role:', error);
        localStorage.removeItem("active-role");
    }

    return user?.role?.[0] ?? null;
}

export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(loadInitialAuthUser);
    const [activeRole, setActiveRoleState] = useState(() => getInitialActiveRole(authUser));

    const defaultRole = useMemo(() => {
        return authUser?.role?.[0] ?? null;
    }, [authUser]);

    useEffect(() => {
        if (!authUser?.role?.length) {
            if (activeRole !== null) {
                setActiveRoleState(null);
                localStorage.removeItem("active-role");
            }
            return;
        }

        if (!activeRole || !authUser.role.includes(activeRole)) {
            const newRole = defaultRole;
            setActiveRoleState(newRole);
            localStorage.setItem("active-role", newRole);
        }

    }, [authUser, activeRole, defaultRole]);

    const updateAuthUser = (user) => {
        setAuthUser(user);
    }

    const setActiveRole = (role) => {
        setActiveRoleState(role);
        localStorage.setItem("active-role", role);
    }

    return (
        <AuthContext.Provider
            value={{
                authUser,
                setAuthUser: updateAuthUser,
                activeRole,
                setActiveRole,
                isSkYouth: activeRole === "youth",
                isSkAdmin: activeRole === "admin",
                isSkSuperAdmin: activeRole === "super_sk_admin",
                isSkNaturalAdmin: activeRole === "natural_sk_admin",
            }}
        >
            {children}
        </AuthContext.Provider >

    );
};

export default AuthContext;


