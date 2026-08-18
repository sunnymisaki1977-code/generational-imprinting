"use client";

import { useState, useEffect } from "react";
import { GodData } from "@/lib/notion";
import { useLiff } from "@/components/providers/LiffProvider";

export default function DrawClient({ gods }: { gods: GodData[] }) {
  const { liff, isReady } = useLiff();
  const [drawGod, setDrawGod] = useState<GodData | null>(null);
  const [blessingText, setBlessingText] = useState("早安！保佑平安順心");
  const [isSending, setIsSending] = useState(false);
  
  // 抽卡狀態：sealed(未開封), flipping(翻牌中), revealed(已揭曉)
  const [drawState, setDrawState] = useState<'sealed' | 'flipping' | 'revealed'>('sealed');

  useEffect(() => {
    // 初始載入時，先在背景隨機挑選一尊，但不翻開
    if (gods.length > 0) {
      const randomIndex = Math.floor(Math.random() * gods.length);
      setDrawGod(gods[randomIndex]);
    }
  }, [gods]);

  const handleDrawClick = () => {
    if (drawState === 'sealed') {
      setDrawState('flipping');
      // 模擬翻牌動畫時間，翻轉完畢後進入 revealed 狀態
      setTimeout(() => {
        setDrawState('revealed');
      }, 1000); // 1秒的翻轉動畫
    }
  };

  const handleRedraw = () => {
    // 蓋回卡片
    setDrawState('sealed');
    
    // 稍微延遲一下，等卡片蓋回去後再換神明，比較自然
    setTimeout(() => {
      if (gods.length > 0) {
        const randomIndex = Math.floor(Math.random() * gods.length);
        setDrawGod(gods[randomIndex]);
      }
    }, 500); 
  };

  const handleSend = async () => {
    if (!liff || !drawGod) return;
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    
    setIsSending(true);
    try {
      const baseUrl = window.location.origin;
      const imageUrl = encodeURIComponent(drawGod.image);
      const blessing = encodeURIComponent(blessingText);
      const godName = encodeURIComponent(drawGod.name);
      const ogUrl = `${baseUrl}/api/og/image.png?imageUrl=${imageUrl}&blessing=${blessing}&godName=${godName}`;

      const res = await liff.shareTargetPicker([
        {
          type: "image",
          originalContentUrl: ogUrl,
          previewImageUrl: ogUrl,
        }
      ]);
      
      if (res) {
        liff.closeWindow();
      }
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
        正在為您準備籤筒...
      </div>
    );
  }

  const isRevealed = drawState === 'revealed';

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 max-w-lg mx-auto w-full overflow-hidden">
      <h1 className="text-2xl font-serif text-ink tracking-widest font-bold my-6">
        🌸 抽籤問候
      </h1>
      
      {/* 3D 抽卡區塊 */}
      <div 
        className="w-full relative [perspective:1200px] cursor-pointer group"
        onClick={handleDrawClick}
      >
        <div 
          className={`
            w-[80%] mx-auto aspect-[9/16] max-h-[65vh] relative transition-all duration-1000 [transform-style:preserve-3d] shadow-2xl rounded-2xl
            ${drawState === 'sealed' ? 'hover:scale-105' : ''}
            ${drawState !== 'sealed' ? '[transform:rotateY(180deg)]' : ''}
          `}
        >
          {/* ====== 卡背 (未開封狀態) ====== */}
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden bg-contain bg-no-repeat bg-center bg-rice border border-ink/10 shadow-lg"
            style={{ backgroundImage: "url('/Gods%20card/card.jpg')" }}
          >
            {/* 翻牌時的高光閃爍特效 */}
            <div className={`
              absolute inset-0 bg-white z-20 pointer-events-none transition-opacity duration-700
              ${drawState === 'flipping' ? 'opacity-100' : 'opacity-0'}
            `}></div>
          </div>

          {/* ====== 卡片正面 (神明圖像) ====== */}
          <div 
            className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl overflow-hidden bg-contain bg-no-repeat bg-center bg-rice border border-ink/10"
            style={{ backgroundImage: `url("${drawGod.image}")` }}
          >
            {/* 模擬 OG Image 漸層與文字 */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-serif text-3xl tracking-widest mb-2 drop-shadow-md">
                {drawGod.name}
              </h3>
              {blessingText && isRevealed && (
                <p className="text-white font-sans text-xl tracking-widest font-bold leading-relaxed whitespace-pre-wrap drop-shadow-md animate-fade-in">
                  {blessingText}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 揭曉後的 UI：重新抽籤、輸入框與按鈕 (使用淡入動畫) */}
      <div className={`
        w-full transition-all duration-700 transform
        ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none absolute'}
      `}>
        <div className="w-full flex justify-end mt-4">
          <button 
            onClick={handleRedraw}
            className="text-ink/60 hover:text-ink font-sans text-sm tracking-widest underline underline-offset-4"
          >
            重新抽籤
          </button>
        </div>

        <div className="w-full mt-4 flex flex-col gap-3">
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

        <div className="w-full mt-8 mb-12">
          <button 
            onClick={handleSend}
            disabled={!isReady || isSending}
            className="w-full py-4 bg-[#06C755] text-white rounded-xl text-2xl tracking-[0.2em] hover:bg-[#05b34c] transition-colors disabled:opacity-50 shadow-lg flex items-center justify-center gap-2"
            style={{ fontFamily: '"Kaiti TC", "BiauKai", "楷體-繁", "標楷體", serif', fontWeight: 600 }}
          >
            {isSending ? "發送中..." : "圖個幸福平安"}
          </button>
          {!isReady && (
            <p className="text-center text-xs text-ink/50 mt-2 tracking-widest">
              正在初始化 LINE 環境...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
