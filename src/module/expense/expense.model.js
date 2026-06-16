import mongoose, { Schema } from "mongoose";

const expenseSchema = new Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    totalExpenditure: {
      type: Number,
      required: [true, "Please enter total Expense"],
      min: 1,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    settlements: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        status: {
          type: String,
          enum: ["PENDING", "PAID"],
          default: "PENDING",
        },
        paidAt: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Expense", expenseSchema);
