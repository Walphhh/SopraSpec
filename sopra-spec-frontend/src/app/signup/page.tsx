import SignupForm from '@/features/auth/components/SignupForm';

export default function Page() {
  return (
    <main className="min-h-screen grid place-items-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign Up</h1>
        <SignupForm />
      </div>
    </main>
  );
}
