import {createContext, useContext, useEffect, useState} from "react";
import {signIn as apiSignIn, signUp as apiSignUp} from "../api/auth";
import {createSelfWorker, getWorkers} from "../api/workers";

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
};

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [worker, setWorker] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const loadUserData = async (token) => {
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        const tokenData = parseJwt(token);
        if (!tokenData?.id || !tokenData?.sub) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        setIsAuthenticated(true);
        const userData = {
            id: tokenData.id,
            username: tokenData.sub,
            email: tokenData.email,
            role: tokenData.role
        };
        setUser(userData);

        try {
            const workers = await getWorkers();
            let userWorker = workers.find(w => w.userId === tokenData.id);

            if (!userWorker) {
                const workerByEmail = workers.find(w => w.email === tokenData.email);
                if (workerByEmail) {
                    try {
                        userWorker = await createSelfWorker({
                            name: workerByEmail.name || userData.username,
                            age: workerByEmail.age || 25,
                            email: tokenData.email
                        });
                    } catch (error) {
                        console.warn("Не удалось связать работника с пользователем:", error);
                        userWorker = workerByEmail;
                    }
                }
            }

            if (userWorker) {
                setWorker(userWorker);
            } else {
                setWorker(null);
            }
        } catch (error) {
            console.warn("Не удалось загрузить данные работника:", error);
            setWorker(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
            loadUserData(savedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (username, password) => {
        try {
            const response = await apiSignIn(username, password);
            localStorage.setItem("token", response.token);
            await loadUserData(response.token);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Ошибка входа в систему"
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await apiSignUp(username, email, password);
            localStorage.setItem("token", response.token);
            await loadUserData(response.token);
            return {success: true};
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || "Ошибка регистрации"
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setWorker(undefined);
        setIsAuthenticated(false);
    };

    const updateWorkerInContext = (updatedWorker) => {
        setWorker(updatedWorker);
    };

    const value = {
        user,
        worker,
        setWorker,
        updateWorkerInContext,
        loading,
        login,
        register,
        logout,
        isAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
