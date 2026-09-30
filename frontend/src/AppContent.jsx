import React from "react";
import Navbar from "./Components/Navbar/Navbar.jsx";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import CreateWorkerPage from "./pages/CreateWorkerPage.jsx";
import ModalContainer from "./Components/Common/ModalContainer/ModalContainer.jsx";
import Loader from "./Components/Common/Loader/Loader.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { isAdmin } from "./utils/role.js";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader />;
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader />;
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

const WorkerRoute = ({ children }) => {
    const { worker, loading } = useAuth();
    if (loading || worker === undefined) return <Loader />;
    return worker ? children : <Navigate to="/create-worker" replace />;
};

const NoWorkerRoute = ({ children }) => {
    const { worker, loading } = useAuth();
    if (loading || worker === undefined) return <Loader />;
    return worker ? <Navigate to="/" replace /> : children;
};

const AdminRoute = ({ children }) => {
    const { user, worker, loading } = useAuth();
    if (loading || worker === undefined) return <Loader />;
    if (!worker) return <Navigate to="/create-worker" replace />;
    return isAdmin(user) ? children : <Navigate to="/" replace />;
};

const AppContent = () => {
    const { loading } = useAuth();

    if (loading) return <Loader />;

    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }/>

                <Route path="/create-worker" element={
                    <PrivateRoute>
                        <NoWorkerRoute>
                            <CreateWorkerPage />
                        </NoWorkerRoute>
                    </PrivateRoute>
                }/>

                <Route path="/" element={
                    <PrivateRoute>
                        <WorkerRoute>
                            <HomePage />
                        </WorkerRoute>
                    </PrivateRoute>
                }/>

                <Route path="/history" element={
                    <PrivateRoute>
                        <WorkerRoute>
                            <AdminRoute>
                                <HistoryPage />
                            </AdminRoute>
                        </WorkerRoute>
                    </PrivateRoute>
                }/>

                <Route path="/stats" element={
                    <PrivateRoute>
                        <WorkerRoute>
                            <AdminRoute>
                                <StatsPage />
                            </AdminRoute>
                        </WorkerRoute>
                    </PrivateRoute>
                }/>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <ModalContainer />
        </>
    );
};

export default AppContent;
