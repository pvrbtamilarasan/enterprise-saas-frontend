import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import EmployeeLeavesDashboard from './components/hcm/leave/EmployeeLeavesDashboard';
import ManagerApprovalDashboard from './components/hcm/leave/ManagerApprovalDashboard';
// Auth components
import Login from './components/auth/Login';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// HCM
import EmployeeList from './components/hcm/EmployeeList';

// Finance
import FinanceDashboard from './components/finance/FinanceDashboard';

// Auth service
import { authService } from './services/api.service';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
};

// Enhanced Theme
const theme = createTheme({
  palette: {
    primary: {
      light: '#4dabf5',
      main: '#1976d2',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f3b9cd',
      main: '#e91e63',
      dark: '#c2185b',
      contrastText: '#fff',
    },
    success: {
      light: '#b3e8b9',
      main: '#4caf50',
      dark: '#388e3c',
    },
    warning: {
      light: '#ffecb3',
      main: '#ff9800',
      dark: '#f57c00',
    },
    error: {
      light: '#ffcdd2',
      main: '#f44336',
      dark: '#d32f2f',
    },
    background: {
      default: '#f9fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="hcm" element={<EmployeeList />} />
          <Route path="hcm/leave" element={<EmployeeLeavesDashboard />} />
          <Route path="hcm/leave-approval" element={<ManagerApprovalDashboard />} />
          <Route path="finance" element={<FinanceDashboard />} />
            {/* Add more protected routes here */}
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
