"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } else {
      const { message } = await res.json().catch(() => ({ message: "Login failed" }));
      alert(message || "Invalid credentials");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <form onSubmit={handleLogin} className="p-6 rounded shadow-md w-80" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>
        <h2 className="text-2xl mb-4 text-center font-bold">Login</h2>
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
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Login
        </button>
        <p className="text-sm text-center mt-3 text-gray-600">No account? <Link href="/signup" className="text-blue-600 hover:underline">Sign up</Link></p>
      </form>
    </main>
  );
}
