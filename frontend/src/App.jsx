import React from 'react';
import './global.css';
import AppRouter from './routers/router';
import { AuthProvider } from './contexts/AuthContext';

const App = () => {
    return (
        <AuthProvider>
            <AppRouter />
        </AuthProvider>
    );
};

export default App;