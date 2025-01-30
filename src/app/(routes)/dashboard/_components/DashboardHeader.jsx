"use client"
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

function DashboardHeader({ setSideNavOpen }) {
    const router = useRouter();


    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            router.push("/Login")
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem("user");
        router.push("/Login")
    };

    return (
        <div className='p-5 shadow-sm border-b flex justify-between'>
            <div className=''>
                <Menu className='md:hidden cursor-pointer' onClick={() => setSideNavOpen(true)} />
            </div>
            <div>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    )
}

export default DashboardHeader
