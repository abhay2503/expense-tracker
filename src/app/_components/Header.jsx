import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'
import HeaderButton from './HeaderButton'

const Header = () => {




    return (
        <div className='p-5 flex justify-between border shadow-sm'>
            <Image src={'./logo.svg'} alt='logo' width={160} height={100} />
            <HeaderButton />

        </div>
    )
}

export default Header