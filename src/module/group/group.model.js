import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
  {
    groupName: {
      type: String,
      minlength: 3,
      maxlength: 50,
      required: [true, "Group name is required"],
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // expenseId is added to give reference of expense
    expenseId: {
      type: Schema.Types.ObjectId,
      ref: "Expense",
      default: null,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "SETTLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Group", groupSchema);
