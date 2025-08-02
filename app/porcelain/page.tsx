"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PorcelainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-jade-green/10 relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-ink-black hover:bg-ancient-gold/10 ancient-text">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold ancient-title text-ink-black">青瓷雅韵</h1>
            <p className="text-sm text-ancient-gold ancient-text">宋窑神工</p>
          </div>
          <div className="w-16"></div>
        </div>
      </div>
      
      <div className="relative z-10 px-6">
        <Card className="ancient-card p-6 mb-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <h4 className="text-lg font-bold ancient-title text-ink-black mb-3 text-center">
            🏛️ 宋瓷文化
          </h4>
          <div className="space-y-2 ancient-text text-deep-ink text-sm">
            <p>• 宋代是中国陶瓷史上的黄金时期</p>
            <p>• 汝、官、哥、钧、定五大名窑闻名于世</p>
            <p>• 青瓷"雨过天青云破处"的美誉传承至今</p>
            <p>• 宋瓷追求"天人合一"的审美境界</p>
          </div>
        </Card>
      </div>
    </div>
  );
}