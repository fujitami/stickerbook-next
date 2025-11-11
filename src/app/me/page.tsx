"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

type Sticker = {
  id: number;
  sticker_id: number;
  title: string;
  caption: string;
  image_url: string;
  author: { id: number; name: string };
  acquired_at: string;
};

export default function MyStickersPage() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/me/ownerships");
      if (res.ok) {
        const data = await res.json();
        setStickers(data);
      } else {
        setError("ログインしていません。");
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p>{error}</p>;

  const sorted = [...stickers].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.acquired_at).getTime() - new Date(a.acquired_at).getTime()
      : new Date(a.acquired_at).getTime() - new Date(b.acquired_at).getTime()
  );

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">わたしのシール帳</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          className="px-3 py-1 bg-black border rounded hover:bg-gray-300"
        >
          {sortOrder === "desc" ? "新しい順" : "古い順"}
        </button>
      </div>

      {sorted.length === 0 ? (
        <p>まだ投稿がありません。</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {sorted.map((s) => (
            <div key={s.id} className="text-center">
              {s.image_url && (
                <Image
                  src={s.image_url}
                  alt={s.caption}
                  width={200}
                  height={200}
                  className="rounded-lg mb-2 object-cover"
                />
              )}
              <p className="text-sm">{s.caption}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
