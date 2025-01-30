import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password Is Required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email Is Required"],
      trim: true,
      unique: true,
    },
    emojiIcon: {
      type: String,
    },
    // budgets: [],
    // expenses: [],
    budgets: [
      {
        emojiIcon: { type: String },
        id: { type: String, required: true }, // Unique identifier for the budget
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ], // Array of budget objects
    expenses: [
      {
        id: { type: String, required: true }, // Unique identifier for the expense
        amount: { type: Number, required: true },
        expensename: { type: String, required: true },
        budgetId: { type: String, required: true }, // Links to the budget id
        createdAt: { type: Date, default: Date.now },
      },
    ], // Array of expense objects
  },
  {
    timestamps: true,
  }
);

// // Clear any cached models before exporting
// if (mongoose.models.User) {
//   delete mongoose.models.User;
// }
// export const User = mongoose.model("User", userSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
