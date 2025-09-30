import Image from "next/image";
import LoginForm from "./LoginForm";

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-md">
        {/* logo */}
        <div className="flex justify-center">
          <Image
            src="/soprema-logo.png"
            alt="SOPREMA"
            width={560}
            height={510}
            priority
          />
        </div>

        {/* title */}
        <h1 className="mt-8 text-2xl font-semibold text-[#1F75CB]">Welcome!</h1>

        {/* form */}
        <div className="mt-4">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
