"use server";

import { User } from "./models";
import connectmongoDB from "./dbConnect";
import bcrypt from "bcrypt";
// import { revalidatePath } from "next/cache";
// import { redirect } from "next/dist/server/api-utils";

export const userRegister = async (formData) => {
  const { name, email, password } = Object.fromEntries(formData);
  try {
    connectmongoDB();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // revalidatePath("/Login");
    // redirect("/Login");
    return { success: true };
  } catch (err) {
    console.log(err);
    return { error: "Failed to create user!" };
  }
};

export const userLogin = async (formData) => {
  const { email, password } = Object.fromEntries(formData);
  if (!email || !password) return { error: "Plz Fill Data Properly" };
  try {
    connectmongoDB();
    const user = await User.findOne({ email });

    if (!user) return { error: "Wrong Credentials" };

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) return { error: "Wrong Credentials" };

    console.log(user);

    return { success: "Logged In", _id: user._id, name: user.name };
  } catch (err) {
    console.log(err);
    return { error: "Failed to login!" };
  }
};

export const checkBudgets = async (id) => {
  try {
    connectmongoDB();
    const user = await User.findOne({ _id: id }).select("budgets");
    console.log(user);
    if (!user || user.budgets.length == 0) {
      return { error: "No Data" };
    }

    return {
      success: "Budget Fetched Successfully",
    };
  } catch (err) {
    console.log(err);
    return { error: "Failed to Fetch" };
  }
};

export const fetchBudgets = async (id) => {
  try {
    connectmongoDB();
    const user = await User.findOne({ _id: id }).select("budgets expenses");
    // console.log(user);

    const { budgets, expenses } = user;

    return {
      success: "Budget Fetched Successfully",
      budgets,
      expenses,
    };
  } catch (err) {
    console.log(err);
    return { error: "Failed to Fetch" };
  }
};

export const insertBudget = async (id, name, amount, emojiIcon) => {
  try {
    connectmongoDB();
    const budget = {
      id: Date.now(),
      name,
      amount,
      emojiIcon,
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { budgets: budget } },
      { new: true, projection: { _id: 1 } } // Return only the _id field
    );

    if (!updatedUser) {
      return { error: "Data Not Added" };
    }
    return { success: "Data Added" };
  } catch (err) {
    return { error: err };
  }
};

export const updateBudget = async (name, amount, emojiIcon, id, budgetId) => {
  try {
    connectmongoDB();
    const updatedUser = await User.findOneAndUpdate(
      { _id: id, "budgets.id": budgetId }, // Match the user by `id` and budget by `budgetId`
      {
        $set: {
          "budgets.$.name": name,
          "budgets.$.amount": amount,
          "budgets.$.emojiIcon": emojiIcon,
        },
      },
      { new: true, projection: { budgets: 1 } } // Return the updated budgets array
    );

    console.log(updateBudget);

    if (!updatedUser) {
      return { error: "Budget not Found" };
    }

    return { success: "Budget updated successfully" };
  } catch (err) {
    return { error: err };
  }
};

export const addExpense = async (name, amount, budgetId, id) => {
  try {
    connectmongoDB();

    const expense = {
      id: Date.now().toString(), // Ensure the id is a string
      amount,
      expensename: name, // Match the schema's field name
      budgetId, // Use `billId` as per your schema
      createdAt: new Date(), // Explicitly set createdAt
    };

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $push: { expenses: expense } }, // Push the correctly structured expense
      { new: true, projection: { _id: 1 } } // Return only the _id field
    );

    if (!updatedUser) {
      return { error: "Data Not Added" };
    }

    return { success: "Data Added" };
  } catch (err) {
    console.error("Error adding expense:", err); // Log the actual error
    return { error: "Failed to add expense" };
  }
};

export const deleteExp = async (id, expenseid) => {
  console.log(expenseid);

  try {
    connectmongoDB();

    const result = await User.updateOne(
      { _id: id }, // Find the user by ID
      { $pull: { expenses: { _id: expenseid } } } // Pull the expense with the matching expense ID
    );
    console.log(result);

    if (result.modifiedCount === 0) {
      return { error: "Data Not Deleted" };
    }
    return { success: "Data Deleted" };
  } catch (error) {
    return { error: "Failed to delete expense" };
  }
};

export const deleteBudg = async (id, budgetId) => {
  try {
    connectmongoDB();
    const budgetResult = await User.updateOne(
      { _id: id }, // Find the user by ID
      { $pull: { budgets: { id: budgetId } } } // Pull the expense with the matching expense ID
    );
    console.log(budgetResult);
    if (budgetResult.modifiedCount === 0) {
      return { error: "Data Not Deleted" };
    }

    const expenseResult = await User.updateMany(
      { _id: id },
      { $pull: { expenses: { budgetId: budgetId } } } // Remove expenses with the matching budgetId
    );

    if (expenseResult.modifiedCount === 0) {
      return { error: "Data Not Deleted" };
    }
    return { success: "Data Deleted" };
  } catch (error) {
    return { error: "Failed to delete budget" };
  }
};
