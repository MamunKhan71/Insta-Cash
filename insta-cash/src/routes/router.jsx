import { createBrowserRouter } from "react-router-dom";
import Login from "../page/Login";
import MainLayout from "../layout/MainLayout";
import Home from "../page/Home";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        children: [
            {
                path: "/",
                element: <Home />
            }
        ]
    },
]);