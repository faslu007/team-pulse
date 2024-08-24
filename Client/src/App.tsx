import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Auth from './Components/Pages/Auth/AuthPage';
import { SnackbarProvider } from './commons/Snackbar/Snackbar';

function App() {

  const renderRoutes = () => (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Auth />} />
      </Route>
    </Routes>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Router>
          {renderRoutes()}
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
