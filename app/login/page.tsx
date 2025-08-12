"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [account, setAccount] = useState(""); // 登录时使用的账号
  const [username, setUsername] = useState(""); // 注册时使用的昵称
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState(""); // 存储新生成的账号
  
  const router = useRouter();

  // 页面加载时检查是否有已登录用户
  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      router.push("/");
    }
  }, [router]);

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError("");
    setAccount("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setAvatar("");
    setShowAccountModal(false);
  };

  // 生成随机头像（修复重复问题）
  const generateRandomAvatar = (): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `https://i.pravatar.cc/150?u=${timestamp}-${randomString}`;
  };

  // 生成唯一账号（6位数字）
  const generateUniqueAccount = (users: any[]): string => {
    const existingAccounts = new Set(users.map(u => u.account));
    const maxAttempts = 1000;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      const newAccount = Math.floor(100000 + Math.random() * 900000).toString();
      
      if (!existingAccounts.has(newAccount)) {
        return newAccount;
      }
      
      attempts++;
    }
    
    throw new Error(`无法生成唯一账号（尝试次数: ${maxAttempts}）`);
  };

  /**
   * 处理登录逻辑
   */
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!account.trim() || !password.trim()) {
      setError("请输入账号和密码");
      setIsLoading(false);
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const matchedUser = users.find(
        (u: { account: string; password: string }) => u.account === account && u.password === password
      );

      if (!matchedUser) {
        setError("账号或密码错误");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify({
        account: matchedUser.account,
        username: matchedUser.username,
        avatar: matchedUser.avatar
      }));
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

    if (!username.trim()) {
      setError("请输入昵称");
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
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // 检查昵称是否已存在
      const isUsernameExist = users.some(
        (u: { username: string }) => u.username === username
      );
      if (isUsernameExist) {
        setError("昵称已存在，请更换");
        setIsLoading(false);
        return;
      }

      // 生成唯一账号
      const accountNum = generateUniqueAccount(users);
      const userAvatar = avatar || generateRandomAvatar();
      
      const newUser = { 
        account: accountNum, 
        username, 
        password, 
        avatar: userAvatar 
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // 存储新账号信息用于显示
      setNewAccount(accountNum);
      
      // 显示账号信息模态框
      setShowAccountModal(true);
    } catch (err: any) {
      setError(err.message || "注册失败，请重试");
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 确认账号并登录
   */
  const confirmAccountAndLogin = () => {
    // 设置当前用户为登录状态
    localStorage.setItem("loggedInUser", JSON.stringify({
      account: newAccount,
      username,
      avatar: avatar || generateRandomAvatar()
    }));
    
    // 关闭模态框并跳转
    setShowAccountModal(false);
    router.push("/");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center font-inter p-4"
      style={{ backgroundImage: `url(/wel.png)` }}
    >
      <div className="absolute inset-0 bg-black opacity-30"></div>

      <div className="relative w-full max-w-sm p-6 bg-white/50 backdrop-blur-sm rounded-lg shadow-xl border border-white/30">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-[#4a4a4a]">临安录</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-[#7d7d7d]">宋韵漫游</h2>
        
        {isLoginMode ? (
          // 登录表单
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">账号</label>
              <input
                type="text"
                placeholder="请输入您的6位账号"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
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
              <label className="block mb-1 text-sm font-medium text-gray-700">昵称</label>
              <input
                type="text"
                placeholder="请输入您的昵称"
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
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">选择头像</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`cursor-pointer w-12 h-12 rounded-full overflow-hidden border-2 ${
                      avatar === `/avatar${num}.jpg` 
                        ? "border-yellow-400" 
                        : "border-gray-300"
                    }`}
                    onClick={() => setAvatar(`/avatar${num}.jpg`)}
                  >
                    <img 
                      src={`/avatar${num}.jpg`} 
                      alt={`头像 ${num}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <div
                  className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    !avatar 
                      ? "border-yellow-400 bg-gray-200" 
                      : "border-gray-300"
                  }`}
                  onClick={() => setAvatar("")}
                >
                  <span className="text-xs text-gray-600">随机</span>
                </div>
              </div>
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

      {/* 账号信息模态框 */}
      {showAccountModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4 text-center text-[#4a4a4a]">注册成功</h3>
            
            <div className="mb-6 text-center">
              <p className="text-lg mb-2">您的账号已生成，请牢记！</p>
              <p className="text-2xl font-bold text-yellow-500 bg-gray-100 py-2 px-4 rounded-md inline-block">
                {newAccount}
              </p>
              <p className="mt-4 text-gray-700">
                昵称: <span className="font-semibold">{username}</span>
              </p>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={confirmAccountAndLogin}
                className="bg-yellow-300 hover:bg-yellow-400 text-gray-800 font-bold py-2 px-6 rounded-md transition-all shadow-md hover:shadow-lg"
              >
                确认
              </button>
            </div>
            
            <p className="mt-4 text-sm text-center text-gray-500">
              请妥善保管您的账号，这是登录的唯一凭证
            </p>
          </div>
        </div>
      )}
    </div>
  );
}