"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { insertBudget } from '@/lib/actions'
import { DialogClose } from '@radix-ui/react-dialog'
import NEXT_URI from '@/app/dat'

const CreateBudget = ({ getBudgetList }) => {
    const [emojiIcon, setemojiIcon] = useState('😀');
    const [openEmojiPicker, setopenEmojiPicker] = useState(false)
    const [name, setName] = useState();
    const [amount, setAmount] = useState();


    const onCreateBudget = async () => {
        try {
            const dat = JSON.parse(localStorage.getItem("user"))
            const response = await fetch(`${NEXT_URI}/api/budget/insert`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: dat.id, name, amount, emojiIcon }),
            });

            const data = await response.json()

            if (data.error) {
                return toast.error(data.error)
            }
            toast.success(data.success)

            reset()
            getBudgetList()
            return
        } catch (error) {
            console.log(error);

            return toast.error(data.error)
        }

    }

    const reset = () => {
        setName()
        setAmount()
        setemojiIcon('😀')
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <div className='bg-slate-100 h-[180px] p-10 rounded-md items-center flex flex-col border-2 border-dashed cursor-pointer hover:shadow-md'>
                        <h2 className='text-3xl'>+</h2>
                        <h2>Create New Budget</h2>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-5'>
                                <Button size="lg" className="text-lg" variant="outline" onClick={() => setopenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker open={openEmojiPicker} onEmojiClick={(e) => {
                                        setemojiIcon(e.emoji)
                                        setopenEmojiPicker(false)
                                    }} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                    <Input placeholder="e.g. Home Decor" onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input type="number" placeholder="e.g. 5000" onChange={(e) => setAmount(e.target.value)} />
                                </div>

                            </div>
                        </DialogDescription>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button disabled={!(name && amount)} onClick={() => onCreateBudget()} className="mt-5 w-full">Create Budget</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>


    )
}

export default CreateBudget