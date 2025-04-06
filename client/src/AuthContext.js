import React, { createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext({
    token: "",
    setToken: () => {},
    userId: null,
    setUserId: () => {},
    handleLogout: () => {},
});
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
    console.log("userId from context:", userId);
    const handleLogout = () => {
        if (userId) {
            setUserId("");
            localStorage.removeItem("user_id");
            setToken("");
            localStorage.removeItem("access_token");
            window.location = `/`;
        }
    };
    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        if (savedToken) {
            setToken(savedToken);
        }
        if (token) {
            localStorage.setItem("access_token", token);
        }},
        []);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};