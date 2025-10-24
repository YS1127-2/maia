# Dressca Frontend (React)

Vue.jsで実装されていたフロントエンドをReactで完全に書き直したバージョンです。

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **Vite 8** - ビルドツール
- **React Router v6** - ルーティング
- **Zustand** - 状態管理
- **React Query** - サーバー状態管理
- **Tailwind CSS v4** - スタイリング
- **MSW (Mock Service Worker)** - APIモック
- **React Hook Form** - フォーム管理
- **Yup** - バリデーション
- **Heroicons** - アイコン
- **Axios** - HTTPクライアント

## プロジェクト構造

```
src/
├── api/          # APIクライアント
├── assets/       # 静的アセット
├── components/   # 共通コンポーネント
├── hooks/        # カスタムフック
├── lib/          # ライブラリ・ユーティリティ
├── mocks/        # MSWモックハンドラー
├── pages/        # ページコンポーネント
├── stores/       # Zustand ストア
├── types/        # TypeScript型定義
└── utils/        # ヘルパー関数
```

## 主要機能

### ページ
- **カタログページ** (`/`) - 商品一覧・検索・フィルタリング
- **ログインページ** (`/authentication/login`) - 認証
- **バスケットページ** (`/basket`) - ショッピングカート
- **チェックアウトページ** (`/ordering/checkout`) - 注文手続き (認証必須)
- **注文完了ページ** (`/ordering/done/:orderId`) - 注文確認 (認証必須)
- **エラーページ** (`/error`) - エラー表示
- **404ページ** - ページが見つからない

### 状態管理
- **認証ストア** - sessionStorageに永続化
- **バスケットストア** - カート状態管理
- **カタログストア** - 商品フィルタリング
- **トーストストア** - 通知管理
- **ユーザーストア** - ユーザー情報
- **スペシャルコンテンツストア** - キャンペーン・セール

## ローカル開発

### 前提条件
- Node.js 22.12.0
- npm 10.9.3

### セットアップ

1. 依存関係のインストール:
```bash
npm install
```

2. 開発サーバーの起動:
```bash
npm run dev
```

アプリケーションは `http://localhost:5173` で起動します。
MSWが自動的に有効化され、APIモックが動作します。

## Docker起動

### フロントエンドのみ起動

```bash
cd /Users/yuheisuzuki/Private/maia/samples/web-csr
docker compose up frontend-react
```

アプリケーションは `http://localhost:5174` でアクセス可能です。

### バックエンドも含めて起動

```bash
cd /Users/yuheisuzuki/Private/maia/samples/web-csr
docker compose up backend frontend-react
```

## 環境変数

`.env.example`を参考に`.env`ファイルを作成してください：

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## ビルド

本番ビルドを作成：

```bash
npm run build
```

ビルドされたファイルは`dist/`ディレクトリに出力されます。

## 脆弱性チェック

すべてのパッケージは脆弱性0で導入されています：

```bash
npm audit
```

## Vueバージョンとの違い

このReactバージョンは、元のVueバージョンと同等の機能を提供しますが、以下の点で改善されています：

- **最新のパッケージ** - すべて最新バージョン、脆弱性0
- **より良い型安全性** - 完全なTypeScriptサポート
- **モダンな状態管理** - ZustandとReact Queryの組み合わせ
- **改善されたパフォーマンス** - React 18の並行機能を活用
- **より良いDX** - Vite 8による高速なHMR

## ライセンス

このプロジェクトは元のMaia OSS Editionプロジェクトと同じライセンスに従います。
