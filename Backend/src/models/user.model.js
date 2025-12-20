import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["player", "scout"], default: "player" },
    isAccountVerified: { type: Boolean, default: false },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Date },
    passwordResetOTP: { type: String, default: "" },
    passwordResetOTPExpireAt: { type: Date },
  },
  { timestamps: true }
);

//bcrypt is used for encrypting the passwords

//{ instead of 10 (It refers the strongness of hashing the password itt may be from 5 t0 15 ,
// if we choose larger number processing speed will be more)
// we can give any number}

//here basically we are just encrypting the password before saving it

//encryption is done using hashing using the bcrypt package

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//here we ar writng a custom method tto check if the user written password is correct or not
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
  