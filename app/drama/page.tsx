"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Palette } from "lucide-react"

// 统一风格
const titleFont =
  '"KaiTi","STKaiti","SimSun","Songti SC","Songti TC",serif';
const accent = "#a94438";

const roles = [
  {
    key: "sheng",
    name: "诸葛亮",
    title: "生角",
    img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Zhuge+Liang+blue+white+scholar&sign=5507d55ae217d163bc8283c67f4f718a",
    desc: [
      "历史来源：诸葛亮脸谱属于生角中的文生脸谱，以其智慧儒雅的形象著称，常见于《空城计》等经典剧目中。",
      "色彩寓意：蓝色代表智慧，白色表示儒雅，整体色调柔和内敛，符合文人谋士的形象。",
      "角色特点：诸葛亮脸谱造型文雅清秀，眉宇间透着智慧与从容，体现了一代名相的气质风范。",
    ],
  },
  {
    key: "dan",
    name: "杨贵妃",
    title: "旦角",
    img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Yang+Guifei+pink+white+beauty&sign=6148742b3f62416ddc4dde68e5eda1f8",
    desc: [
      "历史来源：杨贵妃脸谱属于旦角中的青衣或花旦，展现了中国古代四大美女之一的端庄与妩媚。",
      "色彩寓意：粉色与白色突出女性温婉、柔美的气质，象征美丽与高贵。",
      "角色特点：杨贵妃脸谱造型华美，五官柔和，服饰精致，体现了女性的婉约与雍容。",
    ],
  },
  {
    key: "jing",
    name: "关羽",
    title: "净角",
    img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Guan+Yu+red+white+black+%E4%B8%83%E6%98%9F%E7%97%A3&sign=b14740b3c0f5253b85df870bc64bb16f",
    desc: [
      "历史来源：关羽脸谱为净角中的典型，象征忠义勇武，常见于《三国演义》等剧目。",
      "色彩寓意：红色表忠勇，黑白点缀突出威严，七星点缀为其独特标志。",
      "角色特点：关羽脸谱造型威武，眉目分明，气势磅礴，是中国戏曲中英雄人物的代表。",
    ],
  },
  {
    key: "mo",
    name: "宋江",
    title: "末角",
    img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Song+Jiang+yellow+black+leader&sign=efb561559d70a5be6c700e54a4717b8a",
    desc: [
      "历史来源：宋江脸谱为末角中的代表，常饰演年长、沉稳的领导者形象，见于《水浒传》等剧目。",
      "色彩寓意：黄色与黑色突出其沉稳、果断的性格，象征领导力与责任感。",
      "角色特点：宋江脸谱造型朴实，神情坚毅，体现了草莽英雄的气质。",
    ],
  },
  {
    key: "chou",
    name: "时迁",
    title: "丑角",
    img: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=Chinese+opera+mask+Shi+Qian+white+black+comic&sign=2f5e34ac57b6",
    desc: [
      "历史来源：时迁脸谱为丑角中的经典，机智幽默，常饰演滑稽小人物，见于《水浒传》等剧目。",
      "色彩寓意：以白色小花脸为主，黑色点缀，突出机智、幽默的性格。",
      "角色特点：时迁脸谱造型夸张，表情生动，动作灵活，是喜剧人物的代表。",
    ],
  },
]

export default function DramaEntryPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState(roles[0])
  const [showModal, setShowModal] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToIdx = (idx: number) => {
    setCurrentIdx(idx)
    setSelectedRole(roles[idx])
    if (scrollRef.current) {
      const card = scrollRef.current.children[idx] as HTMLElement
      if (card) {
        const container = scrollRef.current
        const left = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2
        container.scrollTo({ left, behavior: 'smooth' })
      }
    }
  }

  const handleStart = () => {
    router.push("/drama/main")
  }

  useEffect(() => {
    if (scrollRef.current) {
      const handleScroll = () => {
        if (!scrollRef.current) return
        const cards = Array.from(scrollRef.current.children) as HTMLElement[]
        const container = scrollRef.current
        const containerWidth = container.clientWidth

        let centerIdx = 0
        let minDiff = Infinity

        cards.forEach((card, idx) => {
          const cardCenter = card.offsetLeft + card.clientWidth / 2
          const diff = Math.abs(cardCenter - (container.scrollLeft + containerWidth / 2))
          if (diff < minDiff) {
            minDiff = diff
            centerIdx = idx
          }
        })

        setCurrentIdx(centerIdx)
      }

      const scrollContainer = scrollRef.current
      scrollContainer.addEventListener("scroll", handleScroll)
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll)
      }
    }
  }, [scrollRef])

  return (
    <div
      className="bg-cover bg-center min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-cinnabar-red/10 flex flex-col relative"
      style={{ backgroundImage: "url(/drama/bcg.png)", backgroundColor: "#f5f5ef" }}
    >
      {/* 返回按钮 */}
      <div className="relative z-10 w-full max-w-3xl px-4 pt-6">
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 text-black text-base"
          style={{ fontFamily: titleFont, letterSpacing: "0.04em" }}
          aria-label="返回上一页"
        >
          <Image
      src="/return.png"   // 确保 return.png 放在 public 目录
      alt="返回"
      width={40}          // 这里可以调大小，例如 40
      height={40}
      className="object-contain"
      style={{ opacity: 0.7 }}   // 调整透明度
    />
        </button>
      </div>

      <div className="flex-1 text-center">
        {/* 居中标题 */}
        <h1
          className="text-center text-[36px] md:text-[44px] font-bold tracking-widest text-white"
          style={{
            fontFamily: titleFont,
            letterSpacing: "0.06em",
            color: "#ffffff",
            textShadow: "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
          }}
        >
          梨园春秋
        </h1>
        <p
          className="text-center text-[24px] md:text-[24px] font-bold tracking-widest text-white"
          style={{
            fontFamily: titleFont,
            letterSpacing: "0.06em",
            color: "#ffffff",
            textShadow: "0 2px 4px rgba(0,0,0,.45), 0 0 1px rgba(0,0,0,.6), 0 0 6px rgba(0,0,0,.25)",
          }}
        >
          千年脸谱，今朝重现
        </p>
      </div>
      <div className="-mt-20 w-16" />

      {/* 角色卡片横滑区 */}
      <div
  ref={scrollRef}
  className="flex justify-start items-center gap-4 px-4 mt-2 overflow-x-auto"
  style={{
    paddingLeft: '12px',
    paddingRight: '12px',
    scrollSnapType: 'x mandatory',
    overflowY: 'visible',
    minHeight: '520px',
    msOverflowStyle: 'none', // IE / Edge
    scrollbarWidth: 'none',  // Firefox
  }}
>

        {roles.map((role, idx) => {
          const isActive = currentIdx === idx;
          const isHover = hoveredIdx === idx;
          return (
            <Card
              key={role.key}
              className="flex flex-col items-center p-4 cursor-pointer min-w-[320px] max-w-[340px] rounded-2xl relative
                         bg-white/90 backdrop-blur-sm border border-black/10"  /* ← 更白、降低透明度 */
              style={{
                borderColor: isActive || isHover ? accent : "rgba(0,0,0,.08)",
                boxShadow: isActive || isHover ? "0 10px 28px rgba(0,0,0,.20)" : "0 6px 16px rgba(0,0,0,.08)",
                marginLeft: idx === 0 ? '0' : undefined,
                scrollSnapAlign: 'center',
                willChange: 'transform',
                transform: isHover ? 'scale(1.08)' : 'scale(1)',
                zIndex: isActive || isHover ? 10 : 1,
                transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s, border-color 0.25s',
              }}
              onClick={() => { setSelectedRole(role); setShowModal(true); scrollToIdx(idx); }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(-1)}
            >
              {/* 脸谱头像 */}
              <div className="w-36 h-36 mx-auto mb-2 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden">
                <Image src={role.img} alt={role.title} width={140} height={140} className="object-cover rounded-full" />
              </div>

              <div className="text-xl font-bold mb-1 mt-2" style={{ color: accent, fontFamily: titleFont }}>
                {role.name}
              </div>
              <div className="text-base text-ink-black mb-1">角色：{role.title}</div>
              <div className="text-sm text-gray-700 text-center leading-relaxed mt-1" style={{ minHeight: '48px' }}>
                {role.desc[0]}
              </div>
            </Card>
          )
        })}
      </div>

      {/* 分页指示点 —— 往上挪一点 */}
      <div className="flex justify-center items-center -mt-12 mb-2 gap-2 -translate-y-2">
        {roles.map((_, idx) => (
          <div
            key={idx}
            className="w-3 h-3 rounded-full cursor-pointer transition-all"
            style={{
              background: '#d7262b',
              opacity: currentIdx === idx ? 1 : 0.4,
              boxShadow: currentIdx === idx ? '0 0 0 2px #fff' : undefined
            }}
            onClick={() => scrollToIdx(idx)}
          />
        ))}
      </div>

      {/* 介绍弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-40 h-40 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-white relative overflow-hidden">
              <Image src={selectedRole.img} alt={selectedRole.title} width={160} height={160} className="object-cover rounded-full" />
            </div>
            <div className="text-2xl font-bold text-center mb-2 text-ink-black" style={{ fontFamily: titleFont }}>
              {selectedRole.name}
            </div>
            <div className="text-base text-center text-ink-black mb-2">角色：{selectedRole.title}</div>
            {selectedRole.desc.map((d, i) => (
              <div key={i} className="text-sm text-gray-700 mb-1 text-left leading-relaxed">
                <b>{d.split("：")[0]}：</b>{d.split("：")[1]}
              </div>
            ))}
            <Button className="mt-4 w-full" onClick={() => setShowModal(false)}>关闭</Button>
          </div>
        </div>
      )}

      {/* 生成脸谱按钮 —— 实心深红色 */}
      <div className="flex-1 flex flex-col justify-end items-center pb-36 pt-8">
        <Button
          className="w-72 max-w-full py-4 text-xl rounded-lg text-white shadow-lg transition-transform ancient-title hover:brightness-110"
          style={{ background: accent }}   /* ← 实心深红，不用渐变/透明 */
          onClick={handleStart}
        >
          <Palette className="w-6 h-6 mr-2" />
          生成脸谱
        </Button>
      </div>
    </div>
  )
}
