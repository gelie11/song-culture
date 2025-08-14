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
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/chushijiemian.jpg')"}}>
      <div className="w-full max-w-md shadow-xl p-8 border-4 border-yellow-200" >
        <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">文化模块进度</h2>
        <div className="space-y-4 mb-6">
          {modules.map((m, i) => (
            <div key={m.title} className="bg-white/90 rounded-xl p-4 shadow flex items-center border border-yellow-100">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mr-4" style={{background: 'linear-gradient(135deg,#f7e9c2,#e6d7c3)'}}>{m.icon}</div>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-700">{m.title}</div>
                <div className="text-sm text-gray-500 mb-1">{m.subtitle} · {m.desc}</div>
                <div className="w-full h-2 bg-yellow-100 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{width: `${m.percent}%`}}></div>
                </div>
                <div className="text-xs text-right text-yellow-700 mt-1">{m.percent}%</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>router.push('/report/3')} className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-lg font-bold text-white shadow hover:scale-105 transition">下一页</button>
      </div>
    </div>
  );
}
