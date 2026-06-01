import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// 1. BARREIRA DE LOGIN 
export const ProtectedRoute = () => {
    const user = sessionStorage.getItem("user");
    
    if (!user) {
        
        return <Navigate to="/" replace />;
    }
    
    return <Outlet />;
};

// 2. BARREIRA DE ADMIN
export const AdminRoute = () => {
    const userData = sessionStorage.getItem("user");
    
    if (!userData) {
        return <Navigate to="/" replace />;
    }

    const user = JSON.parse(userData);

    if (user.tipo_utilizador !== "admin") {
        return <Navigate to="/pages/home" replace />;
    }

    return <Outlet />;
};