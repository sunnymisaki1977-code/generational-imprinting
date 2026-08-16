"use client";

import { useState, useEffect } from "react";
import { GodData } from "@/lib/notion";
import { useLiff } from "@/components/providers/LiffProvider";

export default function DrawClient({ gods }: { gods: GodData[] }) {
  const { liff, isReady } = useLiff();
  const [drawGod, setDrawGod] = useState<GodData | null>(null);
  const [blessingText, setBlessingText] = useState("早安！保佑平安順心");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // 從陣列中隨機挑選一尊
    if (gods.length > 0) {
      const randomIndex = Math.floor(Math.random() * gods.length);
      setDrawGod(gods[randomIndex]);
    }
  }, [gods]);

  const handleRedraw = () => {
    if (gods.length > 0) {
      const randomIndex = Math.floor(Math.random() * gods.length);
      setDrawGod(gods[randomIndex]);
    }
  };

  const handleSend = async () => {
    if (!liff || !drawGod) return;
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    
    setIsSending(true);
    try {
      // 組合 OG Image 的網址
      const baseUrl = window.location.origin;
      const imageUrl = encodeURIComponent(drawGod.image);
      const blessing = encodeURIComponent(blessingText);
      const godName = encodeURIComponent(drawGod.name);
      const ogUrl = `${baseUrl}/api/og/image.png?imageUrl=${imageUrl}&blessing=${blessing}&godName=${godName}`;

      await liff.shareTargetPicker([
        {
          type: "image",
          originalContentUrl: ogUrl,
          previewImageUrl: ogUrl,
        }
      ]);
      alert("發送成功！");
    } catch (error) {
      console.error("shareTargetPicker failed", error);
      alert("取消傳送或發生錯誤");
    } finally {
      setIsSending(false);
    }
  };

  if (!drawGod) {
    return (
      <div className="flex-1 flex items-center justify-center font-sans tracking-widest text-ink/60">
        正在為您抽籤...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 max-w-lg mx-auto w-full">
      <h1 className="text-2xl font-serif text-ink tracking-widest font-bold my-6">
        🌸 抽籤問候
      </h1>
      
      {/* 卡片預覽區 */}
      <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-ink/10 flex flex-col relative">
        <div 
          className="w-full aspect-[3/4] bg-cover bg-center relative"
          style={{ backgroundImage: `url(${drawGod.image})` }}
        >
          {/* 模擬 OG Image 漸層與文字 */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white font-serif text-3xl tracking-widest mb-2 drop-shadow-md">
              {drawGod.name}
            </h3>
            {blessingText && (
              <p className="text-white font-sans text-xl tracking-widest font-bold leading-relaxed whitespace-pre-wrap drop-shadow-md">
                {blessingText}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end mt-4">
        <button 
          onClick={handleRedraw}
          className="text-ink/60 hover:text-ink font-sans text-sm tracking-widest underline underline-offset-4"
        >
          重新抽籤
        </button>
      </div>

      {/* 輸入區 */}
      <div className="w-full mt-6 flex flex-col gap-3">
        <label className="text-ink/80 font-sans text-sm font-bold tracking-widest">
          請輸入您的祝福語：
        </label>
        <textarea 
          value={blessingText}
          onChange={(e) => setBlessingText(e.target.value)}
          className="w-full p-4 border-2 border-ink/20 rounded-xl bg-white text-ink font-sans outline-none focus:border-vermilion transition-colors resize-none shadow-sm text-lg"
          rows={3}
          maxLength={50}
          placeholder="例如：早安！平安喜樂"
        />
      </div>

      {/* 發送按鈕 */}
      <div className="w-full mt-8 mb-12">
        <button 
          onClick={handleSend}
          disabled={!isReady || isSending}
          className="w-full py-4 bg-[#06C755] text-white rounded-xl font-sans text-lg tracking-widest font-bold hover:bg-[#05b34c] transition-colors disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
        >
          {isSending ? "發送中..." : "LINE 一鍵發送長輩圖"}
        </button>
        {!isReady && (
          <p className="text-center text-xs text-ink/50 mt-2 tracking-widest">
            正在初始化 LINE 環境...
          </p>
        )}
      </div>
    </div>
  );
}
