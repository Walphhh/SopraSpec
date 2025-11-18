import Image from "next/image";
import SignupForm from "./components/SignupForm";
import Link from "next/link"; // 1. ADD THIS IMPORT

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-white">
      <div className="w-full max-w-md">
        {/* logo */}
        <div className="flex justify-center">
          {/* 2. ADD THIS LINK WRAPPER */}
          <Link href="/">
            <Image
              src="/soprema-logo.png"
              alt="SOPREMA"
              width={360}
              height={110}
              priority
            />
          </Link>
          {/* 3. END THE LINK WRAPPER */}
        </div>

        {/* title */}
        <h1 className="mt-8 text-2xl font-semibold text-[#1F75CB]">
          Create Account
        </h1>

        {/* signup form */}
        <div className="mt-4">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}