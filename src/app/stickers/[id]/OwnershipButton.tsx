"use client";

import { useState, useEffect } from "react";

async function fetchStatus(stickerId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/stickers/${stickerId}`,
      {
        credentials: "include",
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error("fetchStatus error", e);
    return null;
  }
}

export default function OwnershipButton({
  stickerId,
  owned,
  ownershipId,
}: {
  stickerId: number;
  owned: boolean;
  ownershipId: number | null;
}) {
  const [isOwned, setIsOwned] = useState(owned);
  const [currentOwnershipId, setCurrentOwnershipId] = useState(ownershipId);
  console.log("OwnershipButton", { stickerId, owned, ownershipId });

  const reloadState = async () => {
    const data = await fetchStatus(stickerId);
    console.log("reloadState data", data);
    if (data) {
      setIsOwned(data.owned);
      setCurrentOwnershipId(data.ownership_id);
    }
  };

  // マウント時にサーバでの初期値と実際のクッキー状態を整合
  useEffect(() => {
    // ただし、最初の表示が server fetch により間違っている可能性があるため、
    // client mount 時点で再取得して正しい状態に更新する
    reloadState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOwn = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/ownerships`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sticker_id: stickerId }),
    });

    if (res.ok) {
      await reloadState();
    } else {
      alert("もらうのに失敗しました");
    }
  };

  const handleUnown = async () => {
    console.log("currentOwnershipId", currentOwnershipId);
    if (!currentOwnershipId) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/ownerships/${currentOwnershipId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {
      await reloadState();
    } else {
      alert("手放すのに失敗しました");
    }
  };

  return (
    <div className="mt-4">
      {isOwned ? (
        <button
          onClick={handleUnown}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          このシールを手放す
        </button>
      ) : (
        <button
          onClick={handleOwn}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          このシールをもらう
        </button>
      )}
    </div>
  );
}
