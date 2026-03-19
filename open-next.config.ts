// OpenNext for Cloudflare 設定ファイル
// @opennextjs/cloudflare

export default {
  // 基本設定
  name: "devcard-pro",
  
  // ビルド設定
  build: {
    // 出力ディレクトリ
    outputDir: ".open-next",
  },
  
  // Cloudflare Pages 設定
  pages: {
    // プロジェクト名
    projectName: "devcard-pro",
  },
  
  // 環境変数
  environment: {
    // Node.js バージョン
    nodeVersion: "20",
  },
};
