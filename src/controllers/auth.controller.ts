import { UserModel } from "../models/users.model.js";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken } from "../utils/jwt.util.js";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const { email } = data;
  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("Email already registered");

  const user = new UserModel(data);
  await user.save();

  const { password, ...safeUser } = user.toObject();
  const token = generateToken({ id: user._id });

  return { user: safeUser, token };
}

export async function loginUser(email: string, password: string) {
  const user = await UserModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const { password: _, ...safeUser } = user.toObject();
  const accessToken = generateToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  return { user: safeUser, accessToken, refreshToken };
}
