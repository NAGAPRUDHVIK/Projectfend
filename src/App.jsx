import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/Login';
import UserPage from './components/employee/UserPage';
import AdminPage from './components/admin/AdminPage';
import EmployeePage from './components/admin/EmployeesPage';
import ParkingPage from './components/admin/ParkingPage';
import VenuePage from './components/admin/VenuePage';
import WorkspacePage from './components/admin/WorkspacePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* User Routes */}
                <Route
                    path="/user"
                    element={
                        <ProtectedRoute allowedRoles={['EMPLOYEE', 'MANAGER']}>
                            <UserPage />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/employees"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <EmployeePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/parking"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <ParkingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/venue"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <VenuePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/workspace"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <WorkspacePage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;