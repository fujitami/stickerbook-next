import Image from "next/image";
import Comments from "./Comments";

export default async function StickerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/stickers/${id}`,
    {
      cache: "no-store",
      credentials: "include",
    }
  );
  if (!res.ok) return <p>データの取得に失敗しました。</p>;

  const sticker = await res.json();

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{sticker.caption}</h1>
      {sticker.image_url && (
        <Image
          src={sticker.image_url}
          alt={sticker.caption}
          width={400}
          height={400}
          className="rounded-lg mb-4"
        />
      )}
      <Comments stickerId={sticker.id} />
    </main>
  );
}
