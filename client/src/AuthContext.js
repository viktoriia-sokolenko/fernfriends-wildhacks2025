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

    // Function to determine the level, name, and emoji based on points
    const getLevelInfo = (points) => {
        if (points >= 750) return { level: 25, name: 'Canopy 🌳' };
        if (points >= 500) return { level: 20, name: 'Bloom 🌸' };
        if (points >= 300) return { level: 15, name: 'Bud 🌼' };
        if (points >= 150) return { level: 10, name: 'Leaf 🍃' };
        if (points >= 50) return { level: 5, name: 'Seedling 🌿' };
        if (points >= 10) return { level: 1, name: 'Sprout 🌱' };
        return { level: 0, name: 'Seed 🌰' };
    };

    // Function to add weekly points based on the number of plants
    const calculateAdditionalPoints = () => {
        let additionalPoints = 0;
        if (user.num_plants >= 21) {
        additionalPoints = 20;
        } else if (user.num_plants >= 11) {
        additionalPoints = 15;
        } else if (user.num_plants >= 6) {
        additionalPoints = 10;
        } else if (user.num_plants >= 2) {
        additionalPoints = 5;
        }
        return additionalPoints;
    };

    // Function to update user data
    const updateUserData = async (updatedUser, token, userId) => {
        try {
            if (!token) {
                token = localStorage.getItem('access_token');
            }
            if (!token) {
                console.error('No token found');
                return;
            }
            if (!userId) {
                userId = localStorage.getItem('user_id');
            }
            if (!userId) {
                console.error('No userId found');
                return;
            }
            console.log('Updating user data for userId:', userId);
            console.log('Token:', token);

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUser),
            });

            if (!response.ok) {
                throw new Error('Failed to update user data');
            }

            const data = await response.json();
            console.log('User data updated successfully:', data);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    // Check if a week has passed since the last points update
    useEffect(() => {
        const lastUpdate = new Date(user.last_points_update);
        const now = new Date();
        const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

        if (now - lastUpdate >= oneWeekInMs) {
            let newPoints = calculateAdditionalPoints();
            console.log('Adding weekly points:', newPoints);

            const updatedUser = {
                points: user.points + newPoints,
                last_points_update: now.toISOString(),
            };

            setUser(updatedUser);
            console.log('Saving:', updatedUser);

            // Call the new function to update user data
            updateUserData(updatedUser, token, userId);
        }
    }, [userId]);

    return (
        <AuthContext.Provider value={{ token, setToken, userId, setUserId, handleLogout, getLevelInfo}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};