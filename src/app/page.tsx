import Image from "next/image";

type Sticker = {
  id: number;
  caption: string;
  image_url: string;
  user_name: string;
};

export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/stickers`, {
    cache: "no-store", // SSRで常に最新を取得
  });

  if (!res.ok) {
    return <p className="text-red-600">APIエラー: {res.status}</p>;
  }

  const stickers: Sticker[] = await res.json();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">おたがいシール帳</h1>
      <ul className="grid grid-cols-2 gap-6 list-none">
        {stickers.map((s) => (
          <li key={s.id} className="bg-white rounded-2xl shadow p-4">
            {s.image_url && (
              <Image
                src={s.image_url}
                alt={s.caption}
                width={200}
                height={200}
                className="rounded-xl mb-2 object-cover"
              />
            )}
            <p className="font-medium">{s.caption}</p>
            <p className="text-slate-600 text-sm">by {s.user_name}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
