"use client"
import NEXT_URI from '@/app/dat'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addExpense } from '@/lib/actions'
import { Loader } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

const AddExpense = ({ budgetId, refreshData }) => {

    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")

    const [loading, setLoading] = useState(false)
    const addNewExpense = async () => {

        setLoading(true)
        const user = JSON.parse(localStorage.getItem("user"))
        try {
            const response = await fetch(`${NEXT_URI}/api/expense/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, amount, budgetId, id: user.id }),
            });

            const data = await response.json();
            console.log(data);

            if (data.error) {
                toast.error(data.error)
                setLoading(false)
            }
            toast.success(data.success)
            reset()
            refreshData()
            setLoading(false)
        } catch (err) {
            toast.error(err)
            setLoading(false)
            return
        }
    }

    const reset = () => {
        setName("")
        setAmount("")
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Name</h2>
                <Input value={name} placeholder="e.g. Bedroom Decor" onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='mt-2'>
                <h2 className='text-black font-medium my-1'>Expense Amount</h2>
                <Input value={amount} type="number" placeholder="e.g. 1000" onChange={(e) => setAmount(e.target.value)} />
            </div>
            <Button onClick={() => addNewExpense()} disabled={!(name && amount) || loading} className="mt-3 w-full">
                {loading ? <Loader className='animate-spin' /> : "Add New Expense"}
            </Button>
        </div>
    )
}

export default AddExpense