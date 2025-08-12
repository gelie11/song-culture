"use client";
import { useRouter } from "next/navigation";
export default function ReportPage3() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/chushijiemian.jpg')"}}>
      <div className="w-full max-w-md bg-white/80 rounded-3xl shadow-xl p-8 border-4 border-yellow-200" style={{marginTop: '5vh'}}>
        <div className="flex items-center mb-4">
          <span className="bg-yellow-200 text-gray-700 px-3 py-1 rounded-full font-bold mr-2">苏轼</span>
          <span className="text-lg font-semibold text-gray-700">东坡寄语</span>
        </div>
        <div className="text-center text-xl font-bold mb-2 text-gray-800">“人生如逆旅，我亦是行人。”</div>
        <div className="text-base text-gray-700 mb-6 leading-relaxed">
          在这次宋韵文化之旅中，您不仅体验了宋代的物质文化，更重要的是感受到了那个时代的精神风貌。青瓷的温润如玉，茶香的清雅淡远，丝绸的华美精致，到诗词的深邃意境；从戏曲的生动表达，到文化的传承创新。
          <br/><br/>
          愿您能将这份宋韵之美带入现代生活，让千年文化在新时代焕发光彩。正如苏轼所言：“但愿人长久，千里共婵娟。”文化的传承，正是这样的美好愿景。
        </div>
        <button onClick={()=>router.push('/')} className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-lg font-bold text-white shadow hover:scale-105 transition">返回首页</button>
      </div>
    </div>
  );
}
