import React, { useContext } from 'react'
import Sidebar from './components/Sidebar'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../provider/AuthProvider'
import { toast, Toaster } from 'sonner'

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext)
    const navigate = useNavigate()
    return (
        <div className='font-poppins'>
            <div className="drawer">
                <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-200 w-full">
                        <div className="flex-none lg:hidden">
                            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-6 w-6 stroke-current">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16">
                                    </path>
                                </svg>
                            </label>
                        </div>
                        <Link to={'/'} className="mx-2 flex-1 px-2 font-bold text-xl">InstaCash</Link>
                        <div className="hidden flex-none lg:block">
                            <ul className="menu menu-horizontal">
                                <li>
                                    <details className="dropdown dropdown-bottom dropdown-end">
                                        <summary>
                                            <div className="avatar placeholder ">
                                                <div className="bg-neutral text-neutral-content w-12 rounded-full p-0">
                                                    <span className='uppercase'>{user?.email.slice(0, 2)}</span>
                                                </div>
                                            </div>
                                        </summary>
                                        <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                            <li>
                                                <button onClick={() => {
                                                    logout()
                                                        .then(() => toast("Signout success!"))
                                                        .then(() => navigate('/login'))
                                                }}>Logout</button>
                                            </li>
                                        </ul>
                                    </details>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <li>
                            <a>
                                <div className="avatar online placeholder">
                                    <div className="bg-neutral text-neutral-content w-16 rounded-full">
                                        <span className='uppercase'>{user?.email.slice(0, 2)}</span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='flex'>
                <div>
                    <Sidebar />
                </div>
                <div className='p-6 w-full'>
                    <Outlet />
                </div>
            </div>
            <Toaster />

        </div>

    )
}
