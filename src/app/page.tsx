import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" h-screen w-full justify-center items-center flex flex-col gap-2">
      <h2 className=" text-2xl font-semibold">Welcome to ticket mangement</h2>
      <Link
        href="/login"
        className=" bg-blue-600 text-[16px] hover:bg-blue-400 text-white px-2 py-1 rounded-md"
      >
        Login
      </Link>
    </div>
  );
}
