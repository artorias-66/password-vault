"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      alert("Signup successful!");
      router.push("/login");
    } else {
      const { message } = await res.json().catch(() => ({ message: "Signup failed" }));
      alert(message || "Signup failed");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <form onSubmit={handleSignup} className="p-6 rounded shadow-md w-80" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>
        <h2 className="text-2xl mb-4 text-center font-bold">Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Sign Up
        </button>
        <p className="text-sm text-center mt-3 text-gray-600">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
      </form>
    </main>
  );
}
