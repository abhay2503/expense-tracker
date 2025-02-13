"use client"
import NEXT_URI from '@/app/dat'
import { deleteExp } from '@/lib/actions'
import { Trash } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const ExpenseListTable = ({ expensesList, refreshData }) => {

    console.log(expensesList);

    const [err, setErr] = useState(null)
    useEffect(() => {
        if (expensesList.length == 0) {
            setErr("No Expense Added!")
        }
        else {
            setErr(null)
        }
    }, [expensesList])
    const deleteExpense = async (expense) => {
        const user = JSON.parse(localStorage.getItem("user"))
        const confirmDelete = window.confirm("Are you sure you want to delete this expense?");

        if (!confirmDelete) {

            return;
        }   
        try {

            const response = await fetch(`${NEXT_URI}/api/expense/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, expenseid: expense._id }),
            });
            const data = await response.json();

            if (data.error)
                return toast.error(data.error)
            toast.success(data.success)
            refreshData()
        } catch (err) {
            console.log(err);

            return toast.error('Failed to Delete')
        }
    }
    return (
        <>
            {err ? (<>
                <div className="flex items-center justify-center h-[75vh]">
                    <p className="text-gray-500 text-xl">{err}</p>
                </div>
            </>) : (<>
                {expensesList.length == 0 ? (<>
                    <div className="flex items-center justify-center h-[75vh]">
                        <p className="text-gray-500 text-xl">Loading...</p>
                    </div>
                </>) : (<>
                    <div className='mt-3'>

                        <div className='grid grid-cols-4 bg-slate-200 p-2'>
                            <h2 className='font-bold'>Name</h2>
                            <h2 className='font-bold' >Amount</h2>
                            <h2 className='font-bold'>Date</h2>
                            <h2 className='font-bold'>Action</h2>
                        </div>
                        {expensesList.map((expenses, index) => (
                            <div className='grid grid-cols-4 bg-slate-50 p-2'>
                                <h2>{expenses.expensename}</h2>
                                <h2>{expenses.amount}</h2>
                                <h2>
                                    {new Date(expenses.createdAt).toLocaleDateString("en-IN", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    }).replace(/\//g, '-')}
                                </h2>
                                <h2><Trash className='text-red-600' onClick={() => deleteExpense(expenses)} /></h2>
                            </div>
                        ))}
                    </div></>)}

            </>)}

        </>

    )
}

export default ExpenseListTable