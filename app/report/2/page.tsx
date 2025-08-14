"use client";
import { useRouter } from "next/navigation";
const modules = [
  { title: "青瓷雅韵", subtitle: "瓷艺精通", desc: "掌握宋代青瓷制作工艺", percent: 85, icon: "🏺" },
  { title: "茶禅一味", subtitle: "茶道大师", desc: "体验宋代妙茶与茶文化", percent: 92, icon: "🍵" },
  { title: "锦绣华章", subtitle: "织锦名家", desc: "创作宋代风格华美服饰", percent: 78, icon: "🧵" },
  { title: "诗词风雅", subtitle: "文要大儒", desc: "感悟东坡诗词的深邃意境", percent: 95, icon: "📜" },
  { title: "梨园春秋", subtitle: "戏曲名角", desc: "体验传统戏曲脸谱艺术", percent: 80, icon: "🎭" },
];
export default function ReportPage2() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/chushijiemian.jpg')" }}>
      <div className="w-full max-w-md shadow-xl p-8 border-0 " >
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">文化模块进度</h2>
        <div className="space-y-4 mb-6">
          {modules.map((m, i) => (
            <div key={m.title} className="bg-white/90 rounded-xl p-4 shadow flex items-center border border-yellow-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4" style={{ background: 'linear-gradient(135deg,#f7e9c2,#e6d7c3)' }}>{m.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-700">{m.title}</div>
                <div className="text-sm text-gray-500 mb-1">{m.subtitle} · {m.desc}</div>
                <div className="w-full h-2 bg-yellow-100 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{ width: `${m.percent}%` }}></div>
                </div>
                <div className="text-xs text-right text-yellow-700 mt-1">{m.percent}%</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mx-auto"
          onClick={() => router.push('/report/3')}
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
