import mongoose from "mongoose";

const Schema = mongoose.Schema;

// User schema definition.
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field."],
      unique: true,
      maxLength: [30, "Name must not have more than 30 characters."],
      minLength: [4, "Name must have more than 4 characters."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      unique: true,
      match: [/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/, "Invalid email format"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
      trim: true,
    },
    resetPasswordToken: {
      type: String,
      required: false,
      trim: true,
    },
    verifyEmailToken: {
      type: String,
      required: false,
      trim: true,
    },
    // gender: {
    //   type: String,
    // },
  },
  { timestamps: true }
);

userSchema.index({ resetPasswordToken: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.model("User", userSchema);
