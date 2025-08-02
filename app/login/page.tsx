"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 简单的登录逻辑，实际应用中应该有更复杂的验证
    if (username && password) {
      // 设置标记，表明是从登录页面返回的
      sessionStorage.setItem('fromLogin', 'true');
      // 登录成功后跳转到首页
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rice-paper via-ivory-white to-jade-green/10 relative overflow-hidden flex items-center justify-center">
      {/* 古风背景纹样 */}
      <div className="absolute inset-0 ancient-pattern" />
      
      {/* 传统纹样背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-jade-green/20 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 w-full max-w-md px-4"
      >
        <Card className="ancient-card p-8 bg-gradient-to-br from-rice-paper to-ivory-white">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-ancient-gold to-bronze-gold rounded-full flex items-center justify-center text-2xl"
            >
              临安录
            </motion.div>
            <h1 className="text-2xl font-bold ancient-title text-ink-black mb-1">宋韵漫游</h1>
            <p className="text-sm text-ancient-gold ancient-text">请登录您的账号</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm ancient-text text-deep-ink">
                用户名
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-ancient-gold/30 focus:border-ancient-gold bg-rice-paper"
                placeholder="请输入您的用户名"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm ancient-text text-deep-ink">
                密码
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-ancient-gold/30 focus:border-ancient-gold bg-rice-paper"
                placeholder="请输入您的密码"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-ancient-gold to-bronze-gold hover:from-bronze-gold hover:to-ancient-gold text-ink-black ancient-text"
            >
              登录
            </Button>

            <div className="text-center mt-4">
              <p className="text-xs ancient-text text-deep-ink/70">
                还没有账号？ 
                <span className="text-ancient-gold cursor-pointer hover:underline">
                  立即注册
                </span>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* 底部装饰 */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-jade-green/20 to-transparent" />
    </div>
  );
}