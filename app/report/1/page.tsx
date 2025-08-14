"use client";
import { useRouter } from "next/navigation";
export default function ReportPage1() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/chushijiemian.jpg')" }}>
      <div className="w-full max-w-sm bg-white/80 rounded-3xl shadow-xl p-8 flex flex-col items-center border-4 " style={{ marginTop: '5vh' }}>
        <div className="w-20 h-20  bg-gradient-to-br flex items-center justify-center mb-4"
          style={{
            maxHeight: '5vh',
          }}
        >
          <span className="text-4xl">🏅</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">文化传承者</h2>
        <div className="text-lg mb-2 text-gray-700">综合成就度：<span className="font-bold text-yellow-700">88%</span></div>
        <div className="w-full h-2 bg-yellow-100 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{ width: '88%' }}></div>
        </div>
        <div className="text-base text-gray-700 text-center mb-6">
          恭喜您完成宋韵文化之旅！您已深度体验了宋代的瓷器、茶道、丝绸、诗词和戏曲文化，成为了一位真正的宋韵文化传承者。
        </div>
        <button
          onClick={() => router.push('/report/2')}
          style={{
            backgroundImage: "url('/login-dl.png')", // 替换成实际背景图路径
            backgroundSize: "cover", // 背景图覆盖容器，可改"120% auto"等
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "200px", // 按需调整按钮宽度
            height: "60px", // 按需调整高度，让背景图完整显示
            border: "none",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span
            className="font-bold text-3xl tracking-wider"
            style={{
              fontSize: "22px",
              color: "#5B4636", // 深棕色文字，适配古风
              textShadow: "0 1px 1px rgba(255,255,255,0.6)",
              fontFamily: "'KaiTi', 'STKaiti', serif",
            }}
          >
            下一页
          </span>
        </button>
      </div>
    </div>
  );
}
