import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, redirectTo = "/", children }) => {
    // verificar si hay sesión activa
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to={redirectTo} replace />;
    }

    // se verificar si tiene el permiso 
    if (!isAllowed) {
        // Si es admin y trata de entrar a rutas de usuario, o viceversa
        return <Navigate to={redirectTo} replace />;
    }

    // Si todo está bien, mostrar la página
    return children ? children : <Outlet />;
};

export default ProtectedRoute;