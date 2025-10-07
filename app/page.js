// app/page.js
"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) router.replace("/dashboard");
    } catch {}
  }, [router]);
  return (
    <main className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <h1 className="text-4xl font-bold mb-6">🔐 Password Vault</h1>
      <p className="text-gray-600 mb-8">Generate and store passwords securely.</p>
      <div className="space-x-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Login
        </Link>
        <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
