"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import ExpenseListTable from './_components/ExpenseListTable';
import { fetchExpenses } from '@/lib/data';
import NEXT_URI from '@/app/dat';


const page = () => {

    const [expensesList, setExpensesList] = useState([])

    useEffect(() => {
        getAllExpenses()
    }, [])

    const getAllExpenses = async () => {
        try {
            const dat = JSON.parse(localStorage.getItem("user"))

            const response = await fetch(`${NEXT_URI}/api/expense/fetch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: dat.id }),
            });

            const data = await response.json()

            if (data.success) {
                setExpensesList(data.expenses)
            } else {
                return toast.error(data.error)
            }
        } catch (err) {
            console.log(err);
            return toast.error("Failed to Fetch")

        }
    }


    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                My Expenses
            </h2>


            <div className='mt-4'>
                <ExpenseListTable expensesList={expensesList} refreshData={() => getAllExpenses()} />
            </div>

        </div>
    )
}

export default page