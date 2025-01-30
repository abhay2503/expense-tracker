"use client"
import React, { use, useEffect, useState } from 'react'
import SideNav from './_components/SideNav'
import DashboardHeader from './_components/DashboardHeader'
import { checkBudgets, fetchBudgets } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import NEXT_URI from '@/app/dat';

export default function DashboardLayout({ children }) {
    const route = useRouter()
    const [sideNavOpen, setSideNavOpen] = useState(false);

    console.log(sideNavOpen);

    useEffect(() => {
        checkUserBudget()
    }, [])

    const checkUserBudget = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) {
                console.error('User  not found in local storage');
                return; // or redirect to login
            }

            const response = await fetch(`${NEXT_URI}/api/user/checkBudgets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id }),
            });
            const data = await response.json()
            console.log(data);


            // Check if the current route is already the budgets page
            if (data.error) {
                if (route.pathname !== "/dashboard/budgets") {
                    // Only redirect if we're not already on the target page
                    return route.replace("/dashboard/budgets");
                }
            }

        } catch (err) {
            console.log(err);

            alert(err);
        }
    }



    return (
        <div>
            {/* Overlay for small screens */}
            {sideNavOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setSideNavOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className="fixed z-50">
                <SideNav sideNavOpen={sideNavOpen} setSideNavOpen={setSideNavOpen} />
            </div>
            <div className='md:ml-64 '>
                <DashboardHeader setSideNavOpen={setSideNavOpen} />
                {children}
            </div>
        </div>
    )
}
