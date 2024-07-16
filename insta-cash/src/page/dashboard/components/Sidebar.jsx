import React from 'react'
import { FaHome, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    return (
        <div className="drawer lg:drawer-open w-full">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col items-center justify-center">
                {/* Page content here */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                    Open drawer
                </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><Link className='font-medium' to={`/dashboard/home`}><FaHome /> Home</Link></li>
                    <li><Link className='font-medium' to={`/dashboard/users`}><FaUser /> Users</Link></li>
                </ul>
            </div>
        </div>
    )
}
