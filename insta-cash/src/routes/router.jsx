import { createBrowserRouter } from "react-router-dom";
import Login from "../page/Login";
import MainLayout from "../layout/MainLayout";
import Home from "../page/Home";
import Register from "../page/Register";
import Dashboard from "../page/dashboard/Dashboard";
import Homepage from "../page/dashboard/components/Homepage";
import UserList from "../page/dashboard/components/UserList";
import SendMoney from "../page/dashboard/components/SendMoney";

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
            },
        ]
    },
    {
        path: '/dashboard',
        element: <Dashboard />,
        children: [
            {
                path: 'home',
                element: <Homepage />
            },
            {
                path: 'users',
                element: <UserList />
            },
            {
                path: 'send-money',
                element: <SendMoney />
            }
        ]
    }
]);