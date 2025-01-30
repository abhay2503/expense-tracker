import React from 'react'
import LoginForm from '../_components/LoginForm'

const page = () => {
    return (
        <div className="font-[sans-serif] bg-white max-w-4xl flex items-center mx-auto md:h-screen p-4">
            <div className="grid md:grid-cols-3 items-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)] rounded-xl overflow-hidden">
                <div className="max-md:order-1 flex flex-col justify-center space-y-16 max-md:mt-16 min-h-full bg-primary lg:px-8 px-4 py-4">
                    <div>
                        <h4 className="text-white text-lg font-semibold">Login To Your Account</h4>
                        <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">Welcome to our Login page!</p>
                    </div>
                    <div>
                        <h4 className="text-white text-lg font-semibold">Simple & Secure Login</h4>
                        <p className="text-[13px] text-gray-300 mt-3 leading-relaxed">Our registration process is designed to be straightforward and secure. We prioritize your privacy and data security.</p>
                    </div>
                </div>

                <LoginForm />
            </div>
        </div>
    )
}

export default page