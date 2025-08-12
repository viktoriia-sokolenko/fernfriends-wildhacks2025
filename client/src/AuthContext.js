import React, { createContext, useState, useEffect, useContext} from 'react';

const AuthContext = createContext({
    token: "",
    setToken: () => {},
    userId: null,
    setUserId: () => {},
    handleLogout: () => {},
    getLevelInfo: () => {}
});
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
    const [user, setUser] = useState({
        points: 0,
        last_points_update: new Date().toISOString(),
    });
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

    // Function to determine the level, name, and emoji based on points
    const getLevelInfo = (points) => {
        if (points >= 300) return { level: 25, name: 'Canopy 🌳' };
        if (points >= 200) return { level: 20, name: 'Bloom 🌸' };
        if (points >= 150) return { level: 15, name: 'Bud 🌼' };
        if (points >= 100) return { level: 10, name: 'Leaf 🍃' };
        if (points >= 50) return { level: 5, name: 'Seedling 🌿' };
        if (points >= 10) return { level: 1, name: 'Sprout 🌱' };
        return { level: 0, name: 'Seed 🌰' };
    };

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout, getLevelInfo}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};