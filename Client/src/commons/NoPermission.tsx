import {
    Box,
    Typography,
    useTheme
} from "@mui/material";
import { Block as BlockIcon } from '@mui/icons-material';

export function NoPermission() {
    const theme = useTheme();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            textAlign="center"
            bgcolor={theme.palette.background.default}
            color={theme.palette.text.primary}
            padding={3}
        >
            <BlockIcon style={{ fontSize: 120, color: theme.palette.error.main }} />
            <Typography variant="h3" gutterBottom>
                Page Not Found
            </Typography>
            <Typography variant="h6" paragraph>
                Sorry, the page you're looking for does not exist or you don't have permission to view it.
            </Typography>
        </Box>
    );
}
