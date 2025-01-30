"use client"
import { fetchEachBudget } from '@/lib/data';
import React, { useEffect, useState } from 'react'
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from '../_components/AddExpense';
import { useParams, useRouter } from 'next/navigation';
import ExpenseListTable from '../_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { Pen, PenBox, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { deleteBudg } from '@/lib/actions';
import EditBudget from '../_components/EditBudget';
import NEXT_URI from '@/app/dat';


const page = () => {

    const router = useRouter();
    const params = useParams(); // Unwrap params

    const [error, setError] = useState(null); // State for error messages
    const [eachBudget, seteachBudget] = useState(null); // State for fetched budget
    const [expensesList, setExpensesList] = useState([])

    useEffect(() => {
        getBudgetInfo()
    }, [])

    const getBudgetInfo = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) {
                setError("User not found");
                return;
            }

            const response = await fetch(`${NEXT_URI}/api/budget/fetchEach`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, budgetid: params.id }),
            });


            const data = await response.json();
            if (data.error) {
                setError(data.error);
                return;
            }

            // Directly access the first budget as you're receiving a single budget
            const budget = data.budget[0];

            if (budget) {

                const filteredExpenses = data.expenses?.filter((expense) => expense.budgetId === budget.id);

                filteredExpenses.length !== 0 ? setExpensesList(filteredExpenses) : setExpensesList([]);

                console.log(filteredExpenses);

                const totalSpend = filteredExpenses ? filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) : 0;
                const totalItem = filteredExpenses ? filteredExpenses.length : 0;

                seteachBudget({
                    ...budget,
                    totalSpend,
                    totalItem,
                });
            }
        } catch (error) {
            alert(error);
            setError("An unexpected error occurred while fetching budget data.");
        }
    }

    const deleteBudget = async () => {
        console.log(params.id);

        const user = JSON.parse(localStorage.getItem("user"))
        try {
            const response = await fetch(`${NEXT_URI}/api/budget/delete`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: user.id, budgetId: params.id }),
            });

            const data = await response.json();

            console.log(data);

            if (data.error)
                return toast.error(data.error)
            toast.success(data.success)
            router.push("/dashboard/budgets")
        } catch (err) {
            console.log(err);
            return toast.error("failed to delete")
        }
    }

    return (
        <div className='p-10'>
            <h2 className='text-2xl font-bold flex justify-between items-center'>
                My Expenses

                <div className='flex gap-2 items-center'>

                    <EditBudget eachBudget={eachBudget} refreshData={() => getBudgetInfo()} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="flex gap-2" variant="destructive"><Trash /> Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your currect budget along with expenses
                                    and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

            </h2>



            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 mt-3 gap-5">
                {eachBudget ? <BudgetItem budget={eachBudget} /> : <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'>
                </div>}
                <AddExpense budgetId={params.id} refreshData={() => getBudgetInfo()} />
            </div>
            <div className='mt-4'>
                <h2 className='font-bold text-lg mt-3'>Latest Expenses</h2>
                <ExpenseListTable expensesList={expensesList} refreshData={() => getBudgetInfo()} />
            </div>

        </div>
    )
}

export default page