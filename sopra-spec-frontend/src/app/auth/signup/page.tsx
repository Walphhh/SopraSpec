import Image from "next/image";
import SignupForm from "./components/SignupForm";

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center p-6 bg-white">
      <div className="w-full max-w-md">
        {/* logo */}
        <div className="flex justify-center">
          <Image
            src="/soprema-logo.png"
            alt="SOPREMA"
            width={360}
            height={110}
            priority
          />
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
