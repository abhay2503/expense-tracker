"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function Hero() {
    const route = useRouter()
    const GetStarted = () => {
        const user = JSON.parse(localStorage.getItem("user"))

        if (!user) {
            route.push("/Login")
            return
        }
        route.push("/dashboard")

    }

    return (
        <section className="bg-gray-50 flex items-center flex-col">
            <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex ">
                <div className="mx-auto max-w-xl text-center">
                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Manage Your Expense
                        <strong className="font-extrabold text-primary sm:block"> Control your Money</strong>
                    </h1>

                    <p className="mt-4 sm:text-xl/relaxed">
                        Start Creating your budget and save ton of money
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Button
                            className="block w-full rounded bg-primary px-12 py-3 text-sm font-medium text-white shadow hover:bg-primary/90 focus:outline-none active:bg-primary sm:w-auto"
                            onClick={() => GetStarted()}
                        >
                            Get Started
                        </Button>


                    </div>
                </div>
            </div>
            <Image src={'/dashboard.png'} alt='dashboard' width={1000} height={700} className='mt-2 rounded-xl border-2 mb-3' />
        </section>
    )
}

export default Hero
