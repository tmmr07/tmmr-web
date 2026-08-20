"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase";

type News = {
  id: number;
  created_at: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
};

export default function NewsDetail() {
  const params = useParams();
  const id = params.id as string;
  
  const [news, setNews] = useState<News | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!id) return;
      try {
        // URLのIDと一致する記事を1件だけ取得する
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setNews(data);
      } catch (err) {
        console.error("データ取得エラー:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p className="text-gray-500 font-bold">読み込み中...</p></div>;
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-bold mb-4">記事が見つかりませんでした。</p>
        <Link href="/" className="text-blue-600 font-bold hover:underline">← トップページに戻る</Link>
      </div>
    );
  }

  const date = new Date(news.created_at);
  const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-gray-500 font-mono">{formattedDate}</span>
          <span className="bg-[rgb(216,12,24)] text-white text-xs font-bold px-3 py-1 rounded-full">
            {news.category}
          </span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8 leading-relaxed">{news.title}</h1>
        
        {/* prose クラスでMarkdownを綺麗に表示！ */}
        <div className="prose max-w-none text-gray-800">
          <ReactMarkdown>{news.content}</ReactMarkdown>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/" className="text-gray-500 font-bold hover:text-gray-800 transition-colors">
            ← トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}