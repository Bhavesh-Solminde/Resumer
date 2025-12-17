import Mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ENV from "../env.js";

const UserSchema = new Mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    resumeHistory: [
      {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "ResumeScan",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      fullName: this.fullName,
      email: this.email,
    },
    ENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = Mongoose.model("User", UserSchema);
export default User;
