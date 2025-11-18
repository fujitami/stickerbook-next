"use client";

import { useEffect, useState } from "react";

type Comment = {
  id: number;
  body: string;
  user: { id: number; email: string };
  // user: { email: string };
};

export default function Comments({ stickerId }: { stickerId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  // 初回ロード時に一覧取得
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/stickers/${stickerId}/comments`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => setComments(data));
  }, [stickerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/stickers/${stickerId}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
        credentials: "include",
      }
    );
    setLoading(false);

    if (res.ok) {
      const newComment = await res.json();
      // 楽観更新：再フェッチせず即反映
      setComments((prev) => [...prev, newComment]);
      setBody("");
    } else {
      alert("コメントの投稿に失敗しました");
    }
  };

  return (
    <section className="mt-6">
      <h2 className="font-semibold mb-2">コメント</h2>

      <ul className="space-y-2 mb-4">
        {comments.map((c) => (
          <li key={c.id} className="border rounded-md p-2 bg-black">
            <strong>{c.user?.email ?? "匿名"}</strong>: {c.body}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="コメントを書く..."
          className="flex-1 border rounded-md px-2 py-1"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white rounded-md px-3 py-1 hover:bg-blue-600"
        >
          {loading ? "送信中..." : "送信"}
        </button>
      </form>
    </section>
  );
}
