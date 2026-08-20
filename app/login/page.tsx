"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // ボタンを押した時に画面がリロードされるのを防ぐ
    setErrorMessage("");

    // Supabaseの認証機能を使ってログイン
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("ログインに失敗しました。メールアドレスとパスワードを確認してください。");
    } else {
      // ログイン成功時、管理者トップページへ移動
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">管理者ログイン</h1>
        
        {errorMessage && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-bold">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition-colors"
          >
            ログインする
          </button>
        </form>
      </div>
    </div>
  );
}