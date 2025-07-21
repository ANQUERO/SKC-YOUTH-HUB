import Reac, {
    Children,
    createContext,
    useContext,
    useEffect,
    useState
} from 'react'

const AuthContext = createContext(undefined);

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new error('useAuthContext must be used with in and AuthContextProvider');
    };

    return context;
};

export const AuthContextProvider = ({ Children }) => {
    const [authUser, setAuthUser] = useState(() => {
        try {
            const sessuionUser = sessionStorage.getItem("auth-user");
            const localUser = localStorage.getItem("auth-user");


            if (sessuionUser) {
                return JSON.parse(sessuionUser);
            }

            if (localUser) {
                return JSON.parse(localUser);
            }

        } catch (error) {
            console.error('Error reading auth state:', error);
            sessionStorage.removeItem("auth-user")
            localStorage.removeItem("auth-user")
        }
        return null;
    });

    const [activeRole, setActiveRoleState] = useState(() => {
        try {
            const storedActiveRole = localStorage.getItem("active-role");
            if (storedActiveRole) {
                return storedActiveRole;
            }
        } catch (error) {
            console.error('Error reading active role from localStorage:', error);
            localStorage.removeItem('active-role');
        }

        if (authUser && Array.isArray(authUser.role) && authUser.role.length > 0) {
            return authUser.role[0];
        }

        return null;
    });

    useEffect(() => {
        if (authUser && Array.isArray(authUser.role) && authUser.role.length > 0) {
            if (activeRole && authUser.role.includes(activeRole)) {
                return;
            } else {
                const newActiveRole = authUser.role[0];
                setActiveRoleState(newActiveRole);
                localStorage.setItem("active-role", newActiveRole);
            }
        } else {
            setActiveRoleState(null);
            localStorage.removeItem("active-role");
        }
    }, [authUser, activeRole]);

    const updateAuthUser = (user) => {
        setAuthUser(user);
    }

    const setActiveRole = (role) => {
        setActiveRoleState(role);
        localStorage.setItem("active-role", role)
    };

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


