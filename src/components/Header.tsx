"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    const res = await apiFetch("/users/sign_out", {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      router.push("/login");
    } else {
      alert("ログアウトに失敗しました");
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-black border-b">
      <Link href="/" className="text-lg font-bold">
        おたがいシール帳
      </Link>
      <nav className="flex gap-3">
        <Link href="/me" className="text-blue-600 hover:underline">
          マイページ
        </Link>
        <button onClick={handleLogout} className="text-red-600 hover:underline">
          サインアウト
        </button>
      </nav>
    </header>
  );
}
