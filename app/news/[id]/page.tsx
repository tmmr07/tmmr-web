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
        const { data, error } = await supabase.from('news').select('*').eq('id', id).single();
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

  // 💡 【追加】カテゴリごとのカラー関数
  const getNewsCategoryColor = (category: string) => {
    switch (category) {
      case '新機能': return 'bg-[#2DA44E]';
      case '不具合': return 'bg-[#D1242F]';
      case '機能改善': return 'bg-[#0969DA]';
      case '不具合修正': return 'bg-[#FB8500]';
      case 'お知らせ': return 'bg-[#8250DF]';
      case 'その他': return 'bg-[#6E7781]';
      default: return 'bg-[#6E7781]';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-gray-500 font-mono">{formattedDate}</span>
          <span className={`${getNewsCategoryColor(news.category)} text-white text-xs font-bold px-3 py-1 rounded-full`}>
            {news.category}
          </span>
        </div>
        
        {/* mb-8 を mb-6 に変更して余白を調整 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6 leading-relaxed">{news.title}</h1>
        
        {/* 💡 【追加】タグがある場合だけ表示する領域 */}
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}

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