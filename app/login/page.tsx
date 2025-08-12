"use client"; // 标记为客户端组件，以便使用 useState 和 useRouter

import React, { useState } from 'react';
import { useRouter } from "next/navigation";

// **修复了这里**：已移除对图片的导入。
// public 文件夹下的图片应通过其 URL 路径直接引用。

/**
 * 这是一个合并了登录和注册功能的认证页面。
 * 用户可以在同一个页面通过切换模式进行登录或注册。
 * 所有用户数据都使用 localStorage 进行管理。
 */
export default function AuthPage() {
  // 状态变量，用于在登录和注册模式之间切换
  const [isLoginMode, setIsLoginMode] = useState(true);
  
  // 表单输入状态
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // 错误信息和加载状态
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(""); // 清除错误信息
  };

  /**
   * 处理登录逻辑
   */
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 验证输入
    if (!username.trim() || !password.trim()) {
      setError("请输入用户名和密码");
      setIsLoading(false);
      return;
    }

    try {
      // 从 localStorage 获取用户列表
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const matchedUser = users.find(
        (u: { username: string; password: string }) => u.username === username && u.password === password
      );

      // 检查用户是否存在
      if (!matchedUser) {
        setError("账号或密码错误");
        setIsLoading(false);
        return;
      }

      // 登录成功，将用户信息存入 localStorage 并重定向到主页
      localStorage.setItem("loggedInUser", username);
      router.push("/");
    } catch (err) {
      setError("登录失败，请重试");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 处理注册逻辑
   */
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 验证输入
    if (!username.trim()) {
      setError("请输入用户名");
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError("请输入密码");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("两次密码不一致");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("密码长度需≥6位");
      setIsLoading(false);
      return;
    }

    try {
      // 从 localStorage 获取用户列表
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const isUsernameExist = users.some(
        (u: { username: string }) => u.username === username
      );
      if (isUsernameExist) {
        setError("用户名已存在，请更换");
        setIsLoading(false);
        return;
      }

      // 注册新用户
      const newUser = { username, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // 注册成功，将用户信息存入 localStorage 并重定向到主页
      router.push("/");
    } catch (err) {
      setError("注册失败，请重试");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center font-inter p-4"
      // **修复了这里**：直接使用 URL 路径来引用图片。
      // 在 Next.js 中，public 文件夹下的文件可以通过 / 根路径访问。
      style={{ backgroundImage: `url(/wel.png)` }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative w-full max-w-sm p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-xl border border-white/30 transform transition-all duration-300">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-[#4a4a4a]">临安录</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-[#7d7d7d]">宋韵漫游</h2>
        
        {/* 根据 isLoginMode 切换表单 */}
        {isLoginMode ? (
          // 登录表单
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                placeholder="请输入您的用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                placeholder="请输入您的密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-600 text-sm font-medium animate-pulse">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-3 rounded-md transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? "登录中..." : "登录"}
            </button>
          </form>
        ) : (
          // 注册表单
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">用户名</label>
              <input
                type="text"
                placeholder="请输入您的用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">密码</label>
              <input
                type="password"
                placeholder="请输入您的密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">确认密码</label>
              <input
                type="password"
                placeholder="请再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-red-600 text-sm font-medium animate-pulse">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-3 rounded-md transition-all disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? "注册中..." : "立即注册"}
            </button>
          </form>
        )}
        
        {/* 切换登录/注册模式的提示 */}
        <p className="text-sm text-center mt-6 text-gray-600">
          {isLoginMode ? "还没有账号？" : "已有账号？"}
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-semibold ml-1"
          >
            {isLoginMode ? "立即注册" : "去登录"}
          </button>
        </p>
      </div>
    </div>
  );
}
