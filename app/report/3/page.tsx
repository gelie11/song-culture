"use client";
import { useRouter } from "next/navigation";
export default function ReportPage3() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/chushijiemian.jpg')" }}>
      <div className="mx-4 max-w-md bg-white/80 rounded-3xl shadow-xl p-8 border-0 " style={{ marginTop: '5vh' }}>
        <div className="flex items-center mb-4">

          <span className="text-lg font-semibold text-gray-700">东坡寄语</span>
        </div>
        <div className="text-center text-xl font-bold mb-2 text-gray-800">“人生如逆旅，我亦是行人。”</div>
        <div className="text-base text-gray-700 mb-6 leading-relaxed">
          在这次宋韵文化之旅中，您不仅体验了宋代的物质文化，更重要的是感受到了那个时代的精神风貌。青瓷的温润如玉，茶香的清雅淡远，丝绸的华美精致，到诗词的深邃意境；从戏曲的生动表达，到文化的传承创新。
          <br /><br />
          愿您能将这份宋韵之美带入现代生活，让千年文化在新时代焕发光彩。正如苏轼所言：“但愿人长久，千里共婵娟。”文化的传承，正是这样的美好愿景。
        </div>
        <button
          className="mx-auto"
          onClick={() => router.push('/')}
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
            返回首页
          </span>
        </button>
      </div>
    </div>
  );
}
