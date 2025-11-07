"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStickerPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image) return setError("画像を選択してください");

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", image);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/stickers`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.errors?.join(", ") || "投稿に失敗しました");
      }

      const data = await res.json();
      router.push(`/stickers/${data.id}`); // 作成後は詳細画面へ遷移
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">シール追加</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="このシールについて説明"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="border rounded w-full p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading ? "送信中..." : "作成"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}
