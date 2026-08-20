"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/lib/supabase"; 

export default function CreateBlog() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "趣味", // デフォルトを趣味に設定
    title: "",
    content: "",
    tags: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 画像アップロード機能（ニュースと同じimagesバケットを使用）
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;
    alert("画像をアップロード中です...");

    try {
      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file);

      if (error) {
        console.error("Upload Error:", error);
        alert("アップロードに失敗しました。");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      setFormData(prev => ({
        ...prev,
        content: prev.content + `\n\n![画像](${imageUrl})\n`
      }));

      alert("画像を挿入しました！");
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("予期せぬエラーが発生しました。");
    }
  };

  // データベースへの送信処理
  const handleSubmit = async () => {
    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      // 💡 保存先を 'blogs' テーブルに変更しています
      const { error } = await supabase
        .from('blogs')
        .insert([
          {
            category: formData.category,
            title: formData.title,
            content: formData.content,
            tags: tagsArray,
            is_published: true,
          }
        ]);

      if (error) {
        console.error("Supabase Error:", error.message);
        alert("データベースへの保存中にエラーが発生しました。");
        return;
      }

      setStep(3);
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("予期せぬエラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-md border border-gray-100">
        
        {/* =========================================
            【ステップ1】入力画面
            ========================================= */}
        {step === 1 && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-8">ブログ作成</h1>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">カテゴリ</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* 💡 カテゴリを要件定義通りに変更 */}
                <option value="趣味">趣味</option>
                <option value="勉強">勉強</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">タイトル</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="例: 豊田スタジアムでの観戦記録、またはProductItem配列の初期化について"
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-gray-700">本文 (Markdown形式)</label>
                <label className="cursor-pointer bg-gray-200 text-gray-700 text-xs font-bold py-1 px-3 rounded hover:bg-gray-300 transition-colors">
                  + 画像を挿入
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="## 見出し&#13;&#10;本文をここに書きます..."
                className="w-full border border-gray-300 rounded-md p-3 h-64 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">タグ (カンマ区切り)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="例: #グランパス, #Java"
                className="w-full border border-gray-300 rounded-md p-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-4 pt-6 mt-6 border-t">
              <Link
                href="/admin"
                className="flex-1 text-center bg-gray-200 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                戻る
              </Link>
              <button
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.content}
                className="flex-1 text-center bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                確認画面へ
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            【ステップ2】確認画面
            ========================================= */}
        {step === 2 && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-8">ブログ作成確認</h1>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-md border border-gray-200">
              <div>
                <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">
                  {formData.category}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{formData.title}</h2>
              </div>
              {formData.tags && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <span key={index} className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded-md">
                        {trimmedTag}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="mt-8 bg-white p-6 rounded border border-gray-200 prose max-w-none text-gray-900">
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t">
              <button
                onClick={() => setStep(1)}
                className="flex-1 text-center bg-gray-200 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                修正する
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 text-center bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                作成する
              </button>
            </div>
          </div>
        )}

        {/* =========================================
            【ステップ3】完了画面
            ========================================= */}
        {step === 3 && (
          <div className="text-center space-y-8 py-10">
            <div className="text-green-500 mb-4">
              <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800">ブログの作成が完了しました！</h1>
            <p className="text-gray-500">データベースへの登録に成功しました。</p>
            
            <div className="flex flex-col gap-4 mt-8 max-w-sm mx-auto">
              <Link
                href="/admin"
                className="w-full text-center bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition-colors"
              >
                管理者ページTOPに戻る
              </Link>
              <Link
                href="/"
                className="w-full text-center border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-md hover:bg-gray-50 transition-colors"
              >
                管理者ページからログアウト
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}