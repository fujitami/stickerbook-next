# おたがいシール帳 — stickerbook-next (フロントエンド)

つくったシール（ステッカー）を投稿して見せあい、他ユーザーに「もらう（所有）」操作ができるシンプルな Web フロントエンドです。

バックエンド（Rails API）は別リポジトリで管理しています: https://github.com/fujitami/stickerbook

## 概要

- **目的**: シールの投稿・閲覧・コメント・所有（Ownership）機能を提供するフロントエンド。バックエンド API と連携して動作します。
- **フロント/バック分離**: フロントは Next.js（TypeScript）で実装され、バックエンドは Rails API（別リポジトリ）です。

## Tech

- **Frontend**: Next.js 15 (TypeScript)
- **Styling**: Tailwind CSS
- **API**: Rails 8 (別リポジトリ: `https://github.com/fujitami/stickerbook`)

## 主な機能

- シール投稿（画像 + キャプション）
- シール一覧・詳細表示
- コメント投稿（シールごと）
- 所有（Ownership）の作成・削除
- ユーザー認証（サインアップ / ログイン）

## 開発（ローカル）クイックスタート

### 前提

- Node.js / npm がインストールされていること
- バックエンドをローカルで動かす場合は Rails（`https://github.com/fujitami/stickerbook`）をポート `3001` 等で起動してください（下記参照）

### フロントエンド (ローカル)

1. 依存インストール

```bash
npm install
```

2. 開発サーバ起動

```bash
# ビルドキャッシュをクリアしてから起動（任意）
rm -rf .next
npm run dev
```

3. ブラウザで開く: `http://localhost:3000`

### バックエンド（参考）

バックエンドは別リポジトリで管理しています: `https://github.com/fujitami/stickerbook`

ローカル起動例（バックエンド側で実行）:

```bash
# 依存インストール
bundle install

# DB 作成・マイグレーション
bin/rails db:create db:migrate

# サーバ起動（例: ポート 3001）
bin/rails server -p 3001
```

フロントは環境変数 `NEXT_PUBLIC_API_BASE` を参照してバックエンドにアクセスします（下記参照）。

## 環境変数

- フロントエンド:

  - `NEXT_PUBLIC_API_BASE` — バックエンド API のベース URL（例: `http://localhost:3001`）

- バックエンド（参考）:
  - `FRONTEND_ORIGIN` — フロントエンドのオリジン（例: `http://localhost:3000`）

開発時は `http://localhost:3000`（Next.js dev） と `http://localhost:3001`（Rails dev） の組み合わせを想定しています。

## 注意事項（CORS / 認証）

- バックエンドは Cookie ベースの認証（Devise 等）を利用する想定です。クロスオリジンで Cookie を扱う場合、CORS 設定、`credentials: 'include'`、SameSite 設定に注意してください。
- 開発中は Rails 側で `credentials: true` や `same_site: :lax` の設定になっていることが多いです。実際の設定はバックエンドの `config/initializers` を確認してください。

## ビルド & デプロイ

- 本番用に静的ビルドしてホストする場合:

```bash
npm run build
npm run start
```

- Vercel 等のホスティングを利用する場合、`NEXT_PUBLIC_API_BASE` を本番 API の URL に設定してください。

## 開発時の注意

- API に関する挙動が怪しい場合はブラウザのネットワークタブでリクエストとレスポンスのヘッダ（特に Set-Cookie / Cookie / CORS）を確認してください。
- フロントの `src/lib/api.tsx` に API 呼び出しの共通処理があります。必要に応じて `credentials: 'include'` の有無を切り替えてください。

## 貢献

- Issue / Pull Request を歓迎します。UI や機能追加、バグ修正などは PR で送ってください。
- 大きな方針変更や破壊的な変更を行う場合は事前に Issue でご相談ください。

## 参考（バックエンド README より抜粋）

- API の主なエンドポイント（詳細はバックエンド側の `config/routes.rb` を参照）:
  - `POST /signup` — ユーザー登録
  - `POST /login` または `POST /users/sign_in` — サインイン
  - `DELETE /logout` — サインアウト
  - `GET /stickers` — ステッカー一覧
  - `GET /stickers/:id` — ステッカー詳細（`owned` / `ownership_id` を含む）
  - `POST /stickers/:id/comments` — コメント作成
  - `POST /ownerships` / `DELETE /ownerships/:id` — 所有の作成・削除
