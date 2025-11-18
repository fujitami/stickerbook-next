"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: { email, password, password_confirmation },
      }),
      credentials: "include",
    });
    if (res.ok) {
      setMessage("サインアップに成功しました！");
      router.push("/me");
    } else {
      const err = await res.json();
      setMessage(`エラー: ${err.errors || res.statusText}`);
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="flex flex-col gap-4 p-6 max-w-sm mx-auto"
    >
      <h1 className="text-xl font-bold">サインアップ</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="パスワード確認"
        value={password_confirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        登録
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
