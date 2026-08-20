"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      // 現在ログインしているユーザーの情報を取得
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // ログインしていなければ、強制的にログイン画面へリダイレクト
        router.push("/login");
      } else {
        // ログインしていれば、ローディング状態を解除して画面を表示
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // 認証チェック中はローディング画面を表示
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-bold">認証情報を確認中...</p>
      </div>
    );
  }

  // 認証OKなら、リクエストされた管理者ページ（children）を表示
  return <>{children}</>;
}