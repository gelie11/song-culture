"use client";
import { useRouter } from "next/navigation"

export default function PoetryPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center relative overflow-hidden" style={{ background: 'url(/poetry-bg.jpg) center/cover no-repeat, #f8f6ef' }}>
      {/* 返回+标题 水平对齐 */}
      <div className="flex items-center w-full max-w-md px-4 mt-8 mb-8">
      <button
          className="flex items-center gap-2 text-ink-black text-xl font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:outline-none z-20 ancient-title"
          style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif', letterSpacing: '0.05em' }}
        onClick={() => router.push("/")}
      >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        返回
      </button>
        <h1 className="flex-1 text-center text-4xl font-bold tracking-widest text-[#7c5c3b] ancient-title -ml-12" style={{ fontFamily: 'YuWeiShuFaXingShuFanTi-1, serif' }}>
        诗词风雅
      </h1>
      </div>
      {/* 四个模块按钮 */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-md px-4">
        <button
          className="bg-white/90 rounded-xl shadow-lg py-6 px-4 flex flex-col items-center border-2 border-[#e6d3b3] hover:scale-105 transition"
          onClick={() => router.push("/poetry/module1")}
        >
          <span className="text-xl font-semibold mb-2">🌅 诗画西湖</span>
          <span className="text-gray-500 text-sm">宋代水墨风，诗画结合</span>
        </button>
        <button
          className="bg-white/90 rounded-xl shadow-lg py-6 px-4 flex flex-col items-center border-2 border-[#e6d3b3] hover:scale-105 transition"
          onClick={() => router.push("/poetry/module2")}
        >
          <span className="text-xl font-semibold mb-2">🧩 诗词秘境</span>
          <span className="text-gray-500 text-sm">卷轴风格，诗词益智</span>
        </button>
        <button
          className="bg-white/90 rounded-xl shadow-lg py-6 px-4 flex flex-col items-center border-2 border-[#e6d3b3] hover:scale-105 transition"
          onClick={() => router.push("/poetry/module3")}
        >
          <span className="text-xl font-semibold mb-2">🎨 看图猜诗</span>
          <span className="text-gray-500 text-sm">意境图+诗词竞猜</span>
        </button>
        <button
          className="bg-white/90 rounded-xl shadow-lg py-6 px-4 flex flex-col items-center border-2 border-[#e6d3b3] hover:scale-105 transition"
          onClick={() => router.push("/poetry/module4")}
        >
          <span className="text-xl font-semibold mb-2">🔍 意象寻踪</span>
          <span className="text-gray-500 text-sm">长卷找意象，诗画互动</span>
        </button>
      </div>
    </div>
  )
}
