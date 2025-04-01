import User from "@/app/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/app/lib/dbConfig";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    if (!email || !password) {
      return NextResponse.json(
        { errorDescription: "Email or password or both are not provided " },
        { status: 400 }
      );
    }
   await  connectDb();
    const user = await User.findOne({ email });
    if (user) {
      console.log("user already exists");

      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const newUser = await User.create({
      email: email,
      password: password,
    });

    return NextResponse.json(
      {
        message: " User registered successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        errorDescription: error.message,
      },
      { status: 500 }
    );
    // throw new Error("Error occurs due to " + error.message);
  }
}
