import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface Iuser {
  email: string;
  password: string;
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
// middleware so pass next in function
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash("password", 10);
  }
  next();
});
// evrything rins on edge ,so there might be possibility that mongoose already create this model so we don't need to call this model again, so if this user model is already exists then we asked to return this user model from any edge
const User = models?.User || model<Iuser>("User", userSchema);

export default User;
