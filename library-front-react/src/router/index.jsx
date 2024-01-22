import { createBrowserRouter, RouterProvider } from "react-router-dom";
import route from './router'

const router = createBrowserRouter(route);
console.log(router)


const RouterApp = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default RouterApp;
