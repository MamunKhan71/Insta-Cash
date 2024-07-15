import { createBrowserRouter } from "react-router-dom";
import Login from "../page/Login";
import MainLayout from "../layout/MainLayout";
import Home from "../page/Home";
import Register from "../page/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            }
        ]
    },
]);