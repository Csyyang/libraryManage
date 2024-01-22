import { createBrowserRouter, RouterProvider } from "react-router-dom";
import route from './router'

const router = createBrowserRouter(route);

const RouterApp = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default RouterApp;
