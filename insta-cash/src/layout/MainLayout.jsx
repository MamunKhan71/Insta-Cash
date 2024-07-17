import React from 'react'
import Home from '../page/Home'
import { Toaster } from 'sonner'
export default function MainLayout() {
    return (
        <div className='font-poppins '>
            <Home />
            <Toaster />
        </div>
    )
}