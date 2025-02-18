"use client";
import Link from "next/link";
import React from "react";
import Form from "next/form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};

const LoginPage = (props: Props) => {
  const router = useRouter();
  const userLogin = async (formdata: FormData) => {
    const email = formdata.get("email");
    const password = formdata.get("password");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <Form action={userLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </Form>
        <div className=" py-2">
          Don't have an account?{" "}
          <Link
            href={"/signup"}
            className=" text-blue-500 hover:underline  px-2 py-1 rounded-md"
          >
            signup
          </Link>{" "}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
