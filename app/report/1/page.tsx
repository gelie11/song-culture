"use client";
import { useRouter } from "next/navigation";
export default function ReportPage1() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{backgroundImage: "url('/chushijiemian.jpg')"}}>
      <div className="w-full max-w-md bg-white/80 rounded-3xl shadow-xl p-8 flex flex-col items-center border-4 border-yellow-200" style={{marginTop: '5vh'}}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center mb-4">
          <span className="text-4xl">🏅</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">文化传承者</h2>
        <div className="text-lg mb-2 text-gray-700">综合成就度：<span className="font-bold text-yellow-700">88%</span></div>
        <div className="w-full h-2 bg-yellow-100 rounded-full mb-4">
          <div className="h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" style={{width: '88%'}}></div>
        </div>
        <div className="text-base text-gray-700 text-center mb-6">
          恭喜您完成宋韵文化之旅！您已深度体验了宋代的瓷器、茶道、丝绸、诗词和戏曲文化，成为了一位真正的宋韵文化传承者。
        </div>
        <button onClick={()=>router.push('/report/2')} className="mt-2 px-6 py-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-lg font-bold text-white shadow hover:scale-105 transition">下一页</button>
      </div>
    </div>
  );
}
