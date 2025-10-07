"use client";
import { useEffect, useMemo, useState } from "react";
import CryptoJS from "crypto-js";

export default function DashboardPage() {
  const [vault, setVault] = useState([]);
  const [title, setTitle] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [token, setToken] = useState("");
  const [search, setSearch] = useState("");
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeLookAlikes, setExcludeLookAlikes] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const SECRET_KEY = process.env.NEXT_PUBLIC_CLIENT_SECRET || "client-encryption-key";

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) window.location.href = "/login";
    else {
      setToken(t);
      fetchVault(t);
    }
  }, []);

  async function fetchVault(t) {
    const res = await fetch("/api/vault", {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (res.ok) {
      const data = await res.json();
      setVault(data);
    }
  }

  function generatePassword() {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+{}[]?";
    if (includeNumbers) chars += nums;
    if (includeSymbols) chars += syms;
    if (excludeLookAlikes) {
      const lookAlikes = /[Il1O0]/g;
      chars = chars.replace(lookAlikes, "");
    }
    let pass = "";
    const array = new Uint32Array(length);
    if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        pass += chars[array[i] % chars.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        pass += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    setPassword(pass);
  }

  function encrypt(data) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  }

  function decrypt(cipher) {
    try {
      const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
      const text = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(text);
    } catch {
      return "";
    }
  }

  async function addVaultItem() {
    const encrypted = {
      title: encrypt(title),
      username: encrypt(username),
      password: encrypt(password),
      url: encrypt(url),
      notes: encrypt(notes),
    };

    const res = await fetch("/api/vault", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(encrypted),
    });

    if (res.ok) {
      alert("Saved!");
      setTitle("");
      setUsername("");
      setPassword("");
      setUrl("");
      setNotes("");
      fetchVault(token);
    }
  }

  async function updateVaultItem() {
    if (!editingId) return;
    const encrypted = {
      id: editingId,
      title: encrypt(title),
      username: encrypt(username),
      password: encrypt(password),
      url: encrypt(url),
      notes: encrypt(notes),
    };

    const res = await fetch("/api/vault", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(encrypted),
    });

    if (res.ok) {
      setEditingId(null);
      setTitle("");
      setUsername("");
      setPassword("");
      setUrl("");
      setNotes("");
      fetchVault(token);
    }
  }

  async function deleteItem(id) {
    await fetch("/api/vault", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    fetchVault(token);
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setTimeout(() => {
      navigator.clipboard.writeText("");
    }, 15000);
  }

  const decryptedVault = useMemo(() => {
    return vault.map((item) => ({
      ...item,
      titlePlain: decrypt(item.title),
      usernamePlain: decrypt(item.username),
      passwordPlain: decrypt(item.password),
      urlPlain: decrypt(item.url),
      notesPlain: decrypt(item.notes),
    }));
  }, [vault, SECRET_KEY]);

  return (
    <main className="min-h-screen p-6" style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}>
      <h1 className="text-3xl font-bold mb-4">🔒 My Vault</h1>

      {/* Password Generator */}
      <div className="p-4 rounded shadow mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>
        <h2 className="font-semibold mb-2">Password Generator</h2>
        <div className="flex items-center gap-2 mb-2">
          <label>Length: {length}</label>
          <input type="range" min="6" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} />
        </div>
        <div className="flex gap-4 mb-2">
          <label><input type="checkbox" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} /> Numbers</label>
          <label><input type="checkbox" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} /> Symbols</label>
          <label><input type="checkbox" checked={excludeLookAlikes} onChange={() => setExcludeLookAlikes(!excludeLookAlikes)} /> Exclude look-alikes (Il1O0)</label>
        </div>
        <button onClick={generatePassword} className="px-4 py-2 bg-blue-600 text-white rounded">Generate</button>
        <p className="mt-2 break-all">{password}</p>
      </div>

      {/* Add Vault Item */}
      <div className="p-4 rounded shadow mb-6" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>
        <h2 className="font-semibold mb-2">Add New Entry</h2>
        <input placeholder="Title" className="border p-2 w-full mb-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="Username" className="border p-2 w-full mb-2" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" className="border p-2 w-full mb-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="URL" className="border p-2 w-full mb-2" value={url} onChange={(e) => setUrl(e.target.value)} />
        <textarea placeholder="Notes" className="border p-2 w-full mb-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {editingId ? (
          <div className="flex gap-2">
            <button onClick={updateVaultItem} className="px-4 py-2 bg-yellow-600 text-white rounded">Update</button>
            <button onClick={() => { setEditingId(null); setTitle(""); setUsername(""); setPassword(""); setUrl(""); setNotes(""); }} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          </div>
        ) : (
          <button onClick={addVaultItem} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
        )}
      </div>

      {/* Vault List */}
      <div className="p-4 rounded shadow" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)", borderWidth: 1 }}>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 w-full mb-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {decryptedVault
          .filter(v => (v.titlePlain || "").toLowerCase().includes(search.toLowerCase()) || (v.usernamePlain || "").toLowerCase().includes(search.toLowerCase()))
          .map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-2">
              <div className="min-w-0">
                <div className="font-semibold truncate">{item.titlePlain || "(untitled)"}</div>
                <div className="text-sm text-gray-500 truncate">{item.usernamePlain}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => copyToClipboard(item.passwordPlain)} className="px-2 py-1 rounded" style={{ backgroundColor: "transparent", borderColor: "var(--border)", borderWidth: 1, color: "var(--foreground)" }}>Copy</button>
                <button onClick={() => { setEditingId(item._id); setTitle(item.titlePlain || ""); setUsername(item.usernamePlain || ""); setPassword(item.passwordPlain || ""); setUrl(item.urlPlain || ""); setNotes(item.notesPlain || ""); }} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                <button onClick={() => deleteItem(item._id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
