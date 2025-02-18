"use server";

import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { signIn } from "next-auth/react";

// Add ticket
export async function userLogin(formdata: FormData) {
  if (formdata) {
    const email = formdata.get("email") as string | null;
    const password = formdata.get("password") as string | null;
    if (email && password) {
      const res = await signIn("Cradentials", {
        email,
        password,
        redirect: false,
      });
      console.log(res);
    }
  }
  // If form data is invalid
  return redirect("/login");
}
