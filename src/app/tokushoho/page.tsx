"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TokushohoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#050505] text-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest mb-8"
          >
            <ArrowLeft size={14} /> Back Home

          </button>

          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="text-white" size={24} />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase">特定商取引法に基づく表記</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300 w-1/3">販売事業者</th>
                <td className="py-4 px-6 text-neutral-300">新里商会</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">住所</th>
                <td className="py-4 px-6 text-neutral-300">請求があった場合には速やかに開示いたします</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">電話番号</th>
                <td className="py-4 px-6 text-neutral-300">請求があった場合には速やかに開示いたします</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">メールアドレス</th>
                <td className="py-4 px-6 text-neutral-300">kobap2501@gmail.com</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">運営責任者</th>
                <td className="py-4 px-6 text-neutral-300">小林孔太郎</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">販売価格</th>
                <td className="py-4 px-6 text-neutral-300">$5.00</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">追加手数料</th>
                <td className="py-4 px-6 text-neutral-300">なし</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">交換・返品ポリシー</th>
                <td className="py-4 px-6 text-neutral-300">デジタル商品のため、決済完了後の返金・キャンセルはお受けできません。商品に不具合がある場合はメールにてご連絡ください。</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">配達時期</th>
                <td className="py-4 px-6 text-neutral-300">決済完了後、即時ダウンロード可能</td>
              </tr>
              <tr className="border-b border-white/5">
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">決済手段</th>
                <td className="py-4 px-6 text-neutral-300">クレジットカード</td>
              </tr>
              <tr>
                <th className="text-left py-4 px-6 bg-white/5 font-bold text-neutral-300">決済期間</th>
                <td className="py-4 px-6 text-neutral-300">クレジットカード決済はただちに処理されます</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/5 text-center space-y-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="text-white" size={16} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">DevCard.Pro</span>
          </div>
          <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-widest">
            © 2026 DevCard.Pro - Engineering Intelligence Platform
          </p>
        </div>
      </div>
    </main>
  );
}
