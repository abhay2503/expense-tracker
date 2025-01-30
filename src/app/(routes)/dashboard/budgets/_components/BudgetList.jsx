"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'

import BudgetItem from './BudgetItem';
import { fetchBudgets } from '@/lib/data';
import NEXT_URI from '@/app/dat';

export default function BudgetList() {
    const [budgets, setBudgets] = useState([]);
    const [err, setErr] = useState(null)
    useEffect(() => {
        getBudgetList();
    }, []);

    // Fetch the list of budgets
    const getBudgetList = async () => {
        try {
            const dat = JSON.parse(localStorage.getItem("user"))

            const response = await fetch(`${NEXT_URI}/api/budget/fetch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: dat.id }),
            });

            const data = await response.json();


            if (data.success) {
                // Add `totalSpend` and `totalItem` for each budget
                if (data.budgets.length == 0) {
                    setErr("No Budget In List!!")
                    return
                }

                const processedBudgets = data.budgets.map((budget) => {

                    let filteredExpenses = data.expenses.filter((expense) => {
                        return expense.budgetId == budget.id
                    });


                    const totalSpend = filteredExpenses ? filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;
                    const totalItem = filteredExpenses ? filteredExpenses.length : 0;

                    return { ...budget, totalSpend, totalItem };
                });

                setBudgets(processedBudgets);
                setErr(null)
            } else {
                alert(data.error)
                setErr("Error In Fetching Budgets!")
                return
            }
        } catch (err) {
            alert(err)
            setErr("Error In Fetching Budgets!")
            return
        }
    };


    return (
        <div className='mt-7'>
            {err ? (<>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <CreateBudget getBudgetList={getBudgetList} />
                </div>
                <div className="flex items-center justify-center h-[30vh]">
                    <p className="text-gray-500 text-xl">{err}</p>
                </div>
            </>) : (<>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    <CreateBudget getBudgetList={getBudgetList} />
                    {budgets?.length > 0 ? budgets.map((budget, index) => (
                        <BudgetItem budget={budget} />
                    )) : [1, 2, 3, 4].map((item, index) => (
                        <div key={index} className='w-full z-10 bg-slate-200 rounded-lg h-[180px] animate-pulse'>

                        </div>
                    ))}
                </div>
            </>)}


        </div>
    )
}
