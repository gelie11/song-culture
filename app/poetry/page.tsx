"use client";
import { useRouter } from "next/navigation";

export default function PoetryPage() {
  const router = useRouter();

  // 系统字体（古风感优先楷/宋）
  const titleFont =
    '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';

  return (
    <div
      className="relative min-h-screen flex flex-col items-center overflow-hidden bg-[#f8f6ef] bg-cover bg-center"
      style={{ backgroundImage: "url(/poetry/bcg2.png)" }} // 或 /silk/background2.png
    >
      {/* 顶部渐变可选 */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/0" />

      {/* 返回按钮（透明背景，无外框） */}
      <div className="relative z-10 w-full max-w-3xl px-4 pt-6">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-white hover:text-gray-200 text-base"
          style={{ fontFamily: titleFont, letterSpacing: "0.04em" }}
          aria-label="返回上一页"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="10" x2="4" y2="10" />
            <polyline points="11 17 4 10 11 3" />
          </svg>
          返回
        </button>
      </div>

      {/* 标题：白色文字 */}
      <div className="relative z-10 w-full max-w-3xl px-4 pt-4 pb-2">
        <h1
          className="text-center text-[40px] md:text-[56px] font-bold tracking-widest text-white"
          style={{
            fontFamily: titleFont,
            letterSpacing: "0.05em",
            textShadow: "0 2px 4px rgba(0,0,0,0.35)",
          }}
        >
          诗词风雅
        </h1>
      </div>

      {/* 模块区：卡片背景调回纯白 */}
      <div className="relative z-10 w-full max-w-2xl px-4 mt-20 md:mt-24 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <button
          className="bg-white rounded-2xl shadow-lg py-5 px-4 flex flex-col items-start border border-[#e6d3b3]/80 hover:shadow-xl hover:-translate-y-0.5 transition"
          onClick={() => router.push("/poetry/module1")}
        >
          <span className="text-lg md:text-xl font-semibold mb-1.5">🌅 诗画西湖</span>
          <span className="text-gray-600 text-sm">宋代水墨风，诗画结合</span>
        </button>

        <button
          className="bg-white rounded-2xl shadow-lg py-5 px-4 flex flex-col items-start border border-[#e6d3b3]/80 hover:shadow-xl hover:-translate-y-0.5 transition"
          onClick={() => router.push("/poetry/module2")}
        >
          <span className="text-lg md:text-xl font-semibold mb-1.5">🧩 诗词秘境</span>
          <span className="text-gray-600 text-sm">卷轴风格，诗词益智</span>
        </button>

        <button
          className="bg-white rounded-2xl shadow-lg py-5 px-4 flex flex-col items-start border border-[#e6d3b3]/80 hover:shadow-xl hover:-translate-y-0.5 transition"
          onClick={() => router.push("/poetry/module3")}
        >
          <span className="text-lg md:text-xl font-semibold mb-1.5">🎨 看图猜诗</span>
          <span className="text-gray-600 text-sm">意境图+诗词竞猜</span>
        </button>

        <button
          className="bg-white rounded-2xl shadow-lg py-5 px-4 flex flex-col items-start border border-[#e6d3b3]/80 hover:shadow-xl hover:-translate-y-0.5 transition"
          onClick={() => router.push("/poetry/module4")}
        >
          <span className="text-lg md:text-xl font-semibold mb-1.5">🔍 意象寻踪</span>
          <span className="text-gray-600 text-sm">长卷找意象，诗画互动</span>
        </button>
      </div>
    </div>
  );
}
