import Link from "next/link";

export default function AdminTop() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-20 px-6">
      <div className="bg-white p-10 rounded-xl shadow-md w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-8 text-center border-b pb-4">
          管理者トップページ
        </h1>
        
        <div className="flex flex-col gap-6">
          <Link 
            href="/admin/news/new"
            className="w-full bg-blue-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            ニュースの作成
          </Link>
          
          <Link 
            href="/admin/blog/new"
            className="w-full bg-emerald-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            ブログの作成
          </Link>
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors underline">
            サイトトップ（公開ページ）へ戻る
          </Link>
        </div>
      </div>
    </div>
  );
}