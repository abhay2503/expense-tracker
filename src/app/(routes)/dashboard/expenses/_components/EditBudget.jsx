"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import EmojiPicker from 'emoji-picker-react'
import { Input } from '@/components/ui/input'
import { updateBudget } from '@/lib/actions'
import { PenBox } from 'lucide-react'
import { toast } from 'sonner'
import NEXT_URI from '@/app/dat'

const EditBudget = ({ eachBudget, refreshData }) => {
    const [emojiIcon, setemojiIcon] = useState(eachBudget?.emojiIcon);
    const [openEmojiPicker, setopenEmojiPicker] = useState(false)
    const [name, setName] = useState();
    const [amount, setAmount] = useState();

    useEffect(() => {
        if (eachBudget) {
            setemojiIcon(eachBudget?.emojiIcon)
            setName(eachBudget?.name)
            setAmount(eachBudget?.amount)
        }

    }, [eachBudget])
    const onUpdateBudget = async () => {
        const user = JSON.parse(localStorage.getItem("user"))

        try {
            const response = await fetch(`${NEXT_URI}/api/budget/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, amount, emojiIcon, id: user.id, budgetId: eachBudget.id }),
            });
            const data = await response.json();

            if (data.error) {
                toast.error(data.error)
            }
            toast.success(data.success)
            reset()
            refreshData()
        } catch (err) {
            console.log(err);

            toast.error("failed To Update")
        }
    }

    const reset = () => {
        setName("")
        setAmount("")
        setemojiIcon('😀')
    }

    return (
        <div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex gap-2"><PenBox /> Edit</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
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
                                    <Input placeholder="e.g. Home Decor" defaultValue={eachBudget?.name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                    <Input type="number" defaultValue={eachBudget?.amount} placeholder="e.g. 5000" onChange={(e) => setAmount(e.target.value)} />
                                </div>

                            </div>
                        </DialogDescription>
                        <DialogFooter className="sm:justify-start">
                            <DialogClose asChild>
                                <Button disabled={!(name && amount)} onClick={() => onUpdateBudget()} className="mt-5 w-full">Update Budget</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget