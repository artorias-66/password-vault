"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function HeaderClient() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [theme, setTheme] = useState("system");

  function readAuthFromStorage() {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          setUserEmail(payload?.email || "");
        } else {
          setUserEmail("");
        }
        setIsAuthed(true);
      } else {
        setIsAuthed(false);
        setUserEmail("");
      }
    } catch {
      setIsAuthed(false);
      setUserEmail("");
    }
  }

  useEffect(() => {
    readAuthFromStorage();

    const saved = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      setTheme("system");
      applyTheme("system");
    }
  }, []);

  useEffect(() => {
    // Re-evaluate auth on route changes
    readAuthFromStorage();
  }, [pathname]);

  useEffect(() => {
    function onStorage(e) {
      if (e.key === "token") readAuthFromStorage();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    try { localStorage.removeItem("token"); } catch {}
    setIsAuthed(false);
    setUserEmail("");
    router.push("/login");
  }

  function applyTheme(next) {
    const root = document.documentElement;
    if (next === "dark") {
      root.setAttribute("data-theme", "dark");
    } else if (next === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try { localStorage.setItem("theme", next); } catch {}
    applyTheme(next);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
      <Link href="/" className="font-semibold">🔐 Vault</Link>
      <nav className="flex items-center gap-3 text-sm">
        <button onClick={toggleTheme} className="px-3 py-1 rounded" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }} aria-label="Toggle theme">
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <Link href="/dashboard" className={pathname === "/dashboard" ? "text-blue-600" : "hover:text-blue-600"}>Dashboard</Link>
        {!isAuthed && (
          <>
            <Link href="/login" className={pathname === "/login" ? "text-blue-600" : "hover:text-blue-600"}>Login</Link>
            <Link href="/signup" className={pathname === "/signup" ? "text-blue-600" : "hover:text-blue-600"}>Sign Up</Link>
          </>
        )}
        {isAuthed && (
          <>
            <span className="text-xs sm:text-sm opacity-80">{userEmail}</span>
            <button onClick={logout} className="px-3 py-1 rounded" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>Logout</button>
          </>
        )}
      </nav>
    </div>
  );
}
