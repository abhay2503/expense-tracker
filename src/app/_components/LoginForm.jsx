"use client"
import { userLogin } from '@/lib/actions';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { toast } from 'sonner';
import NEXT_URI from '../dat';


const LoginForm = () => {

    const [err, setErr] = useState()
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const handleLogin = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const userData = {
            email: formData.get("email"),
            password: formData.get("password"),
        };
        console.log(userData);

        setLoading(true);
        try {
            // Simulate delay using setTimeout
            // setTimeout(async () => {
            const response = await fetch(`${NEXT_URI}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });
            const data = await response.json();

            if (data.error) {
                toast.error(data.error);
                setLoading(false);
                return;
            }

            const userDetails = {
                id: data._id,
                name: data.name, // Assuming `name` contains the username
            };

            toast.success("Logged In Successfully");

            localStorage.setItem("user", JSON.stringify(userDetails));
            router.push("/dashboard");
            setLoading(false);
            // }, 2000); // Set a delay of 2 seconds (2000ms)
        } catch (error) {
            console.log(error);
            toast.error("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };


    return (
        <form onSubmit={handleLogin} className="md:col-span-2 w-full py-6 px-6 sm:px-16">
            <div className="mb-6">
                <h3 className="text-gray-800 text-2xl font-bold">Login To Account</h3>
            </div>

            <div className="space-y-6">

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
                    <div className="relative flex items-center">
                        <input name="email" type="email" required className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500" placeholder="Enter email" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4" viewBox="0 0 682.667 682.667">
                            <defs>
                                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                                </clipPath>
                            </defs>
                            <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                                <path fill="none" strokeMiterlimit="10" strokeWidth="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                                <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                            </g>
                        </svg>
                    </div>
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Password</label>
                    <div className="relative flex items-center">
                        <input name="password" type="password" required className="text-gray-800 bg-white border border-gray-300 w-full text-sm px-4 py-2.5 rounded-md outline-blue-500" placeholder="Enter password" />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                        </svg>
                    </div>
                </div>


            </div>
            {err && (<p className='text-center text-red-500 mt-3'>{err}</p>)}

            <div className="!mt-12">
                <button type="submit" disabled={loading} className={`disabled:bg-primary/70 disabled:cursor-not-allowed bg-primary hover:bg-primary/90 w-full py-3 px-4 tracking-wider text-sm rounded-md text-white  focus:outline-none m-auto`}>
                    {loading ? <Loader className='animate-spin' /> : "Login to your account"}
                </button>
            </div>

            <p className="text-gray-800 text-sm mt-6 text-center">Don't have an account? <Link href="/Register" className="text-blue-600 font-semibold hover:underline ml-1">Register here</Link></p>

        </form >
    )
}

export default LoginForm