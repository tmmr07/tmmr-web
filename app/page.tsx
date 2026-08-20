"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dancing_Script } from 'next/font/google';
import { supabase } from "@/lib/supabase";

const dancingScript = Dancing_Script({ subsets: ['latin'], display: 'swap', weight: '700'});

// データの型を定義
type News = {
  id: number;
  created_at: string;
  category: string;
  title: string;
};

type Blog = {
  id: number;
  created_at: string;
  category: string;
  title: string;
};

export default function Home() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [blogList, setBlogList] = useState<Blog[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);

  // ページ読み込み時にデータを取得
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('id, created_at, category, title')
          .order('created_at', { ascending: false })
          .limit(5); // 最新の5件を取得
        if (!error && data) setNewsList(data);
      } finally {
        setIsLoadingNews(false);
      }
    };

    const fetchBlog = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, created_at, category, title')
          .order('created_at', { ascending: false })
          .limit(5); // 最新の5件を取得
        if (!error && data) setBlogList(data);
      } finally {
        setIsLoadingBlog(false);
      }
    };

    fetchNews();
    fetchBlog();
  }, []);

  // 日付をYYYY.MM.DD形式に変換する関数
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  // ニュースのカテゴリごとに色を変える関数
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

  // ブログのカテゴリごとに色を変える関数
  const getBlogCategoryColor = (category: string) => {
    switch (category) {
      case '趣味': return 'bg-emerald-600';
      case '勉強': return 'bg-blue-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <main className="w-full">
      {/* 1. ファーストビュー */}
      <section className="relative h-screen w-full">
        {/* 背景画像 */}
        <Image
          src="/top_toyota_stadium.jpeg"
          alt="top_image"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />

        {/* ヘッダー領域（ロゴとナビゲーション） */}
        <header className="absolute top-0 left-0 w-full z-20 flex justify-between items-center px-8 py-8">
          {/* 左側：ロゴ画像 */}
          <div className="relative w-40 h-12">
            <Image 
              src="/tmmr_logo.png" 
              alt="tmmr logo" 
              fill 
              sizes="160px"
              className="object-contain object-left"
              priority
            />
          </div>
          
          {/* 右側：ナビゲーションメニュー */}
          <nav className="hidden md:flex gap-8">
            <Link href="#" className="text-white font-bold border-b-2 border-white pb-1 hover:text-gray-300 transition-colors">
              このサイトについて
            </Link>
            <Link href="#" className="text-white font-bold border-b-2 border-white pb-1 hover:text-gray-300 transition-colors">
              ブログ
            </Link>
            <Link href="#" className="text-white font-bold border-b-2 border-white pb-1 hover:text-gray-300 transition-colors">
              ニュース＆更新情報
            </Link>
            <Link href="#" className="text-white font-bold border-b-2 border-white pb-1 hover:text-gray-300 transition-colors">
              ポートフォリオ
            </Link>
          </nav>
        </header>

        {/* 中央のキャッチコピー */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 z-10">
          <h1 className={`text-[rgb(186,168,91)] text-8xl text-left ${dancingScript.className}`}>
            Never Give Up for the Win
          </h1>
        </div>
      </section>
      
      {/* 2. ニュースセクション */}
      <section className="w-full py-24 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-48 shrink-0 flex flex-col items-center md:items-start mb-8 md:mb-0">
              <h2 className="text-4xl font-bold tracking-widest text-gray-800 text-center md:text-left">
                NEWS
                <span className="block text-sm font-normal text-[rgb(216,12,24)] mt-2">
                  最新情報
                </span>
              </h2>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 pb-4">
                {isLoadingNews ? (
                  <p className="text-gray-500 font-bold p-4">読み込み中...</p>
                ) : newsList.length === 0 ? (
                  <p className="text-gray-500 font-bold p-4">まだお知らせはありません。</p>
                ) : (
                  newsList.map((news) => (
                    <Link href={`/news/${news.id}`} key={news.id}>
                      <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                        <time className="text-gray-500 font-mono w-28 shrink-0">
                          {formatDate(news.created_at)}
                        </time>
                        <span className={`${getNewsCategoryColor(news.category)} text-white text-xs font-bold px-3 py-1 rounded-full w-24 text-center shrink-0`}>
                          {news.category}
                        </span>
                        <p className="font-medium text-gray-800 flex-1">
                          {news.title}
                        </p>
                      </article>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* 3. ブログセクション（UPDATEをBLOGに変更） */}
      <section className="w-full py-24 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            <div className="md:w-48 shrink-0 flex flex-col items-center md:items-start mb-8 md:mb-0">
              <h2 className="text-4xl font-bold tracking-widest text-gray-800 text-center md:text-left">
                BLOG
                <span className="block text-sm font-normal text-blue-600 mt-2">
                  ブログ
                </span>
              </h2>
            </div>
            <div className="flex-1">
              <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 pb-4">
                {isLoadingBlog ? (
                  <p className="text-gray-500 font-bold p-4">読み込み中...</p>
                ) : blogList.length === 0 ? (
                  <p className="text-gray-500 font-bold p-4">まだブログ記事はありません。</p>
                ) : (
                  blogList.map((blog) => (
                    <Link href={`/blog/${blog.id}`} key={blog.id}>
                      <article className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                        <time className="text-gray-500 font-mono w-28 shrink-0">
                          {formatDate(blog.created_at)}
                        </time>
                        <span className={`${getBlogCategoryColor(blog.category)} text-white text-xs font-bold px-3 py-1 rounded-full w-24 text-center shrink-0`}>
                          {blog.category}
                        </span>
                        <p className="font-medium text-gray-800 flex-1">
                          {blog.title}
                        </p>
                      </article>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* 4. 試合結果 ＆ X(Twitter) セクション */}
      <section className="w-full py-24 bg-zinc-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col">
              <h2 className="text-2xl font-bold tracking-widest text-gray-800 mb-6 border-b pb-4">
                MATCH RESULT
                <span className="block text-sm font-normal text-[rgb(216,12,24)] mt-1">
                  直近の試合結果
                </span>
              </h2>
              <div className="flex-1 flex flex-col justify-center mb-8">
                <p className="text-center text-sm text-gray-500 font-bold mb-4">
                  2026 明治安田J1リーグ
                </p>
                <div className="flex justify-center items-center gap-6 mb-6">
                  <div className="text-xl font-bold text-gray-800 w-24 text-right">名古屋</div>
                  <div className="text-4xl font-bold text-[rgb(216,12,24)] tracking-widest">2 - 1</div>
                  <div className="text-xl font-bold text-gray-800 w-24 text-left">FC東京</div>
                </div>
                <div className="text-sm text-gray-600 bg-zinc-50 p-4 rounded-md space-y-2">
                  <p><span className="font-bold text-[rgb(216,12,24)]">【名古屋】</span> 15&apos; キャスパー ユンカー, 80&apos; 永井 謙佑</p>
                  <p><span className="font-bold text-gray-500">【FC東京】</span> 60&apos; ディエゴ オリヴェイラ</p>
                </div>
              </div>
              <div className="flex justify-between items-center gap-4 mt-auto">
                <Link href="#" className="flex-1 text-center bg-[rgb(216,12,24)] text-white text-sm font-bold py-3 rounded-full hover:bg-red-700 transition-colors shadow-sm">
                  試合の詳細
                </Link>
                <Link href="#" className="flex-1 text-center border-2 border-[rgb(216,12,24)] text-[rgb(216,12,24)] text-sm font-bold py-3 rounded-full hover:bg-red-50 transition-colors shadow-sm">
                  日程・結果一覧
                </Link>
              </div>
            </div>
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-8 flex flex-col">
              <h2 className="text-2xl font-bold tracking-widest text-gray-800 mb-6 border-b pb-4 flex items-center justify-between">
                <div>
                  MY POSTS
                  <span className="block text-sm font-normal text-black mt-1">
                    公式 X (Twitter)
                  </span>
                </div>
                <span className="text-2xl font-bold">𝕏</span>
              </h2>
              <div className="flex flex-col gap-4 max-h-[350px] overflow-y-auto pr-2 pb-4">
                <div className="bg-zinc-50 p-5 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Your Name</p>
                      <p className="text-xs text-gray-500">@your_account_id</p>
                    </div>
                    <time className="ml-auto text-xs text-gray-400">2時間前</time>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    シミュレーションの実験回しつつ、DAZNで試合の見逃し配信チェック中💻⚽ 次の学会発表の準備も進めなきゃだけど、やっぱりグランパスの試合は気になる！ #grampus
                  </p>
                </div>
                <div className="bg-zinc-50 p-5 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Your Name</p>
                      <p className="text-xs text-gray-500">@your_account_id</p>
                    </div>
                    <time className="ml-auto text-xs text-gray-400">8月10日</time>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    新しいPC構成にしてからDockerのビルドもMinecraftの描画もサクサクで最高すぎる。Obsidianでのタスク管理も快適になって研究が捗るわー。
                  </p>
                </div>
                <div className="bg-zinc-50 p-5 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full shrink-0"></div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Your Name</p>
                      <p className="text-xs text-gray-500">@your_account_id</p>
                    </div>
                    <time className="ml-auto text-xs text-gray-400">8月5日</time>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">
                    今日の試合、最高の展開だった！スタジアムの熱気もすごかったし、勝ち点3はデカい！次節もこの勢いで頼むぞ🔥 #grampus
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. フッター */}
      <footer className="w-full bg-[#f8f9fa] pt-16 pb-12 border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <Link href="#" className="flex justify-between items-center text-lg font-bold text-gray-900 hover:text-[rgb(216,12,24)] transition-colors border-b border-gray-300 pb-3">
                FAQ・お問い合わせ
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-6">おすすめサイト</h3>
              <ul className="space-y-4 text-sm font-medium text-gray-700">
                <li><Link href="#" className="hover:text-[rgb(216,12,24)] transition-colors">名古屋グランパス公式サイト</Link></li>
                <li><Link href="#" className="hover:text-[rgb(216,12,24)] transition-colors">Jリーグ.jp（日本プロサッカーリーグ）</Link></li>
                <li><Link href="#" className="hover:text-[rgb(216,12,24)] transition-colors">豊田スタジアム</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-6">公式SNS</h3>
              <div className="flex gap-4">
                <Link href="#" className="w-10 h-10 bg-black text-white rounded-md flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
                <Link href="#" className="w-10 h-10 bg-[#FF0000] text-white rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-300 flex flex-col md:flex-row justify-between items-center gap-6">
            <ul className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 text-xs font-medium text-gray-600">
              <li><Link href="#" className="hover:text-[rgb(216,12,24)] transition-colors">サイトマップ</Link></li>
              <li><Link href="#" className="hover:text-[rgb(216,12,24)] transition-colors">サイト利用について</Link></li>
              <li><Link href="#" className="hover:text-[rgb(216,12,24)] transition-colors">個人情報の取り扱いについて</Link></li>
            </ul>
            <p className="text-xs text-gray-500 font-mono tracking-widest text-center md:text-right">
              &copy;2026 YOUR NAME. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}