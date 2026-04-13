import Link from "next/link";
import { AuthForm } from "@/modules/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="space-y-6">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link className="text-teal-200" href="/register">
            Register di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
