import Image from "next/image";
import Header from "@/components/Header";
import Comments from "./Comments";
import OwnershipButton from "./OwnershipButton";

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
  console.log("StickerDetail sticker", sticker);

  return (
    <>
      <Header />
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
        <OwnershipButton
          stickerId={sticker.id}
          owned={sticker.owned}
          ownershipId={sticker.ownership_id}
        />
        <Comments stickerId={sticker.id} />
      </main>
    </>
  );
}
