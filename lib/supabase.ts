import { createClient } from '@supabase/supabase-js';

// .env.local に設定した環境変数を読み込む
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseのクライアント（接続窓口）を作成してエクスポート
export const supabase = createClient(supabaseUrl, supabaseAnonKey);