"use client"
import React, { useEffect, useState } from 'react'
import CardsInfo from './_components/CardsInfo'
import { fetchBudgets, fetchExpenses } from '@/lib/data'
import BarChartDashboard from '@/app/_components/BarChartDashboard'
import BudgetItem from './budgets/_components/BudgetItem'
import ExpenseListTable from './expenses/_components/ExpenseListTable'
import { useRouter } from 'next/navigation'
import NEXT_URI from '@/app/dat'

const Page = () => {
    const route = useRouter();

    const [user, setUser] = useState({});
    const [budgets, setBudgets] = useState([]);
    const [expenseList, setExpensesList] = useState([]);
    const [err, setErr] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            route.push("/Login");
            return;
        }
        setUser(user);
        getBudgetList();
    }, []);

    // Fetch the list of budgets
    const getBudgetList = async () => {
        try {
            const dat = JSON.parse(localStorage.getItem("user"));



            const response = await fetch(`${NEXT_URI}/api/budget/fetch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: dat.id }),
            });

            const data = await response.json();

            console.log(data);

            if (data.success) {
                if (data.budgets.length === 0) {
                    setErr("Please add a budget first.");
                    return;
                }

                // Add `totalSpend` and `totalItem` for each budget
                const processedBudgets = data.budgets.map((budget) => {
                    let filteredExpenses = data.expenses.filter(
                        (expense) => expense.budgetId === budget.id
                    );

                    const totalSpend = filteredExpenses
                        ? filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
                        : 0;
                    const totalItem = filteredExpenses ? filteredExpenses.length : 0;

                    return { ...budget, totalSpend, totalItem };
                });

                setBudgets(processedBudgets);
                getAllExpenses();
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert(err);
        }
    };

    const getAllExpenses = async () => {
        try {
            const dat = JSON.parse(localStorage.getItem("user"));

            const response = await fetch("/api/expense/fetch", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: dat.id }),
            });

            const data = await response.json(); // Adjust the API endpoint based on your setup

            if (data.success) {
                setExpensesList(data.expenses);
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert(err);
        }
    };

    return (
        <div className="p-5">
            {err ? (
                <>
                    <div>
                        <h2 className="font-bold text-3xl">Hi, {user.name} ✌️</h2>
                        <p className="text-gray-500">
                            Here's what happening with your money, let's manage your expenses.
                        </p>
                    </div>
                    <div className="flex items-center justify-center h-[65vh]">
                        <p className="text-gray-500 text-xl">{err}</p>
                    </div>
                </>


            ) : (
                <>
                    {budgets.length == 0 ? (<>
                        <div>
                            <h2 className="font-bold text-3xl">Hi, {user.name} ✌️</h2>
                            <p className="text-gray-500">
                                Here's what happening with your money, let's manage your expenses.
                            </p>
                        </div>
                        <div className="flex items-center justify-center h-[65vh]">
                            <p className="text-gray-500 text-xl">Loading...</p>
                        </div>
                    </>) : (<>
                        <h2 className="font-bold text-3xl">Hi, {user.name} ✌️</h2>
                        <p className="text-gray-500">
                            Here's what happening with your money, let's manage your expenses.
                        </p>
                        <CardsInfo budgetList={budgets} />

                        <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">
                            <div className="md:col-span-2">
                                <BarChartDashboard budgetList={budgets} />
                                <h2 className="font-bold text-lg mt-3">Latest Expenses</h2>
                                <ExpenseListTable
                                    expensesList={expenseList}
                                    refreshData={() => getBudgetList()}
                                />
                            </div>
                            <div className="gap-5">
                                <h2 className="font-bold text-lg mb-2">Latest Budgets</h2>
                                {budgets.map((budget, index) => (
                                    <BudgetItem key={index} budget={budget} />
                                ))}
                            </div>
                        </div>
                    </>)}

                </>
            )}
        </div>
    );
};

export default Page;
