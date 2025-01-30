"use client";
import { LayoutGrid, PiggyBank, ReceiptText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

function SideNav({ sideNavOpen, setSideNavOpen }) {

    console.log(sideNavOpen);

    const menuList = [
        {
            id: 1,
            name: "Dashboard",
            icon: LayoutGrid,
            path: "/dashboard",
        },
        {
            id: 2,
            name: "Budgets",
            icon: PiggyBank,
            path: "/dashboard/budgets",
        },
        {
            id: 3,
            name: "Expenses",
            icon: ReceiptText,
            path: "/dashboard/expenses",
        },
    ];

    const path = usePathname();

    useEffect(() => {
        console.log(path);
    }, [path]);

    return (
        <div className="h-screen flex flex-col z-10">


            {/* SideNav  toggled menu */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white p-5 border shadow-sm transition-transform transform ${sideNavOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0 md:relative md:z-auto`}
            >

                {/* Header for smaller screens */}
                <div className="md:hidden flex items-center justify-between p-4 shadow-sm">
                    <Image src={"/logo.svg"} width={120} height={80} alt="Logo" />
                    <button
                        className="text-gray-500 p-2 rounded-md hover:bg-gray-100"
                        onClick={() => setSideNavOpen(false)}
                    >
                        {/* Hamburger icon */}
                        {setSideNavOpen ? "✖" : "☰"}
                    </button>
                </div>
                <Image className="hidden md:block" src={"/logo.svg"} width={160} height={100} alt="Logo" />
                <div className="mt-5">
                    {menuList.map((menu) => (
                        <Link key={menu.id} href={menu.path}>
                            <h2
                                className={`flex gap-2 mb-2 items-center text-gray-500 font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-100
                    ${path === menu.path && "text-primary bg-blue-100"
                                    }`}
                            >
                                <menu.icon />
                                {menu.name}
                            </h2>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Overlay when the menu is open */}
            {/* {setSideNavOpen && (
                <div
                    className={`-z-30 fixed inset-0 bg-black bg-opacity-50 ${sideNavOpen ? 'block' : 'hidden'}`}
                    onClick={() => setSideNavOpen(false)}
                ></div>
            )} */}
        </div>
    );
}

export default SideNav;
