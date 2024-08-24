import React from "react";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Define styled component with TypeScript
const AppContainer = styled("div")(() => ({
    display: "grid",
}));

// Define props type if needed
interface PrivateRoutesProps {
    path?: string; // Optional prop, adjust as needed based on usage
}

// Convert component to TypeScript
const PrivateRoutes: React.FC<PrivateRoutesProps> = () => {
    return (
        <AppContainer>
            <Outlet />
        </AppContainer>
    );
};

export default PrivateRoutes;
