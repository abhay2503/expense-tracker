"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const HeaderButton = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("user");
        console.log(user);

        if (user) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    const handleLogout = () => {
        // Clear user data from localStorage on logout
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        router.push("/Login")
    };

    return (
        <div className="sidebar">
            {isLoggedIn ? (
                <Button onClick={handleLogout}>
                    Logout
                </Button>

            ) : (
                <Link href="/Login">
                    <Button>Login</Button>
                </Link>
            )}
        </div>
    )
}

export default HeaderButton