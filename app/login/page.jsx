import { LoginForm } from "../../components/login-form";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 mt-16">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </Suspense>
    </div>
  );
}
