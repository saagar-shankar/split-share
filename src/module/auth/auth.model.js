// import { required } from "joi";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 50,
      trim: true,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      minlength: 3,
      maxlength: 50,
    },
    password: {
      type: String,
      minlength: 8,
      maxlength: 20,
      required: [true, "password cannot be empty/min 8 characters"],
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    // this verificationTokenExpires added on 7-june-2026
    verificationTokenExpires: {
      type: String,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  // if password is not modified then we can safely return without re-hashing the password
  if (!this.isModified("password")) return;
  // if password does changes or first time we are storing it then just hash it
  this.password = await bcrypt.hash(this.password, 10);
});

// very important
// we are adding compare password method in our schema

// --------Don't use arrow function cause they inherit this from surrounding
// userSchema.methods.comparePassword = async (password) => {
//   return await bcrypt.compare(password, this.password);
// };

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);
