import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isGerente, setIsGerente] = useState(false);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('usuario');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setIsGerente(parsedUser.role === 'gerente');
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsGerente(userData.role === 'gerente');
        sessionStorage.setItem('usuario', JSON.stringify(userData));
        sessionStorage.setItem('loggedIn', true);
    };

    const logout = () => {
        setUser(null);
        setIsGerente(false);
        sessionStorage.removeItem('usuario');
        sessionStorage.removeItem('loggedIn');
    };

    return (
        <AuthContext.Provider value={{ user, isGerente, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};