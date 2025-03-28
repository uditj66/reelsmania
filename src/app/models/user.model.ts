import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface Iuser {
  email: String;
  password: String;
  _id?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<Iuser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash("password", 10);
  }
  next();
});

const User = models?.User || model<Iuser>("User", userSchema);

export default User;
