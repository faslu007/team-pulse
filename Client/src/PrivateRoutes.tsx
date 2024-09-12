import React, { useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { socketInstance } from "./SocketInstance";  

// Define styled component with TypeScript
const AppContainer = styled("div")(() => ({
    display: "grid",
}));

// Define props type if needed
interface PrivateRoutesProps {
    path?: string; // Optional prop, adjust as needed based on usage
}
const isAuthenticated = (authUser) => {
    return authUser ? true : false;
};

// Convert component to TypeScript
const PrivateRoutes: React.FC<PrivateRoutesProps> = () => {
    const authUser = localStorage.getItem('_id');

    useEffect(() => {
        if (authUser) {
            socketInstance.connect('http://localhost:4001', authUser)
                .then(() => {
                    console.log('Socket connected successfully');
                    const socketId = socketInstance.getSocketId();
                    console.log('Socket ID:', socketId);
                })
                .catch((error) => {
                    console.error('Failed to connect socket:', error);
                });
        }
    }, []);

    return isAuthenticated(authUser) ? (
        <AppContainer>
            <Outlet />
        </AppContainer>
    ) : (
        <Navigate to="/" />
    );
};

export default PrivateRoutes;
