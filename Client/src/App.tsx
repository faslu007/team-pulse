import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './themeLight';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Auth from './Pages/Auth/AuthPage';
import { SnackbarProvider } from './commons/Snackbar/Snackbar';
import RoomManage from './Pages/Rooms/RoomManage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LiveEvent from './Pages/LiveEvent/Event';

function App() {
  const renderRoutes = () => (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/manage-session" element={<RoomManage />} />
        <Route path="/live-event/:roomId" element={<LiveEvent />} />
      </Route>
      <Route path="/" element={<Auth />} />
    </Routes>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Router>
            {renderRoutes()}
          </Router>
        </LocalizationProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
