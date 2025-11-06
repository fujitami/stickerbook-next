"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function MePage() {
  const [me, setMe] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/me");
      if (res.ok) {
        const data = await res.json();
        setMe(data);
      } else {
        setError("ログインしていません。");
      }
    })();
  }, []);

  if (error) return <p>{error}</p>;
  if (!me) return <p>読み込み中...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ようこそ {me.email}</h1>
      <pre>{JSON.stringify(me, null, 2)}</pre>
    </div>
  );
}
