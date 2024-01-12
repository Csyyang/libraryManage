import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from '../App'
import Login from "../pages/login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: '/login',
        element: <Login />
    }
]);

const RouterApp = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default RouterApp;
